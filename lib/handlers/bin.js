var async      = require('asyncjs'),
    path       = require('path'),
    crypto     = require('crypto'),
    utils      = require('../utils'),
    errors     = require('../errors'),
    custom     = require('../custom'),
    blacklist  = require('../blacklist'),
    scripts    = require('../../scripts.json'),
    processors = require('../processors'),
    Observable = utils.Observable;

module.exports = Observable.extend({
  constructor: function BinHandler(sandbox) {
    Observable.apply(this, arguments);

    this.models = sandbox.models;
    this.helpers = sandbox.helpers;
    this.mailer = sandbox.mailer;

    // For now we bind all methods to the class scope. In reality only those
    // used as route callbacks need to be bound.
    var methods = Object.getOwnPropertyNames(BinHandler.prototype).filter(function (prop) {
      return typeof this[prop] === 'function';
    }, this);

    utils.bindAll(this, methods);
  },
  getDefault: function (req, res, next) {
    if (req.subdomain && custom[req.subdomain]) {
      return this.getCustom(req, res, next);
    }
    this.renderFiles(req, res);
  },
  getFromPost: function (req, res, next) {
    var data = utils.extract(req.body, 'html', 'css', 'javascript');

    'html css javascript'.split(' ').forEach(function (panel) {
      if (data[panel]) {
        data[panel] = decodeURIComponent(data[panel]);
      }
    });

    data.settings = {};

    this.render(req, res, data);
  },
  getCustom: function (req, res, next) {
    var config = custom[req.subdomain],
        overrides = config.defaults,
        _this = this;

    this.loadFiles(this.defaultFiles(), function (err, defaults) {
      if (err) {
        return next(err);
      }

      for (var key in defaults) {
        if (overrides[key]) {
          defaults[key] = overrides[key];
        }
      }

      _this.render(req, res, defaults, config);
    });
  },
  getBin: function (req, res, next) {
    this.render(req, res, req.bin);
  },
  live: function (req, res, next) {
    req.live = true;
    next();
  },
  embed: function (req, res, next) {
    req.embed = true;
    next();
  },
  getBinPreview: function (req, res, next) {
    var options = {
      edit: !req.param('quiet'),
      silent: !!req.param('quiet'),
      csrf: req.session._csrf
    };

    this.formatPreview(req.bin, options, function (err, formatted) {
      if (err) {
        next(err);
      }

      if (formatted) {
        res.send(formatted);
      } else {
        res.contentType('js');
        res.send(req.bin.javascript);
      }
    });
  },
  // TODO decide whether this is used anymore
  getBinSource: function (req, res) {
    res.contentType('json');
    var output = JSON.stringify(this.templateFromBin(req.bin));
    if (!req.ajax) {
      res.contentType('js');
      output = 'var template = ' + output;
    }
    res.send(output);
  },
  getBinSourceFile: function (req, res) {
    var format = req.params.format,
        settings = req.bin.settings || {},
        reverseProcessorLookup = {},
        key;

    if (format === 'js' || format === 'json') {
      format = 'javascript';
    }

    if (format === 'md') {
      format = 'markdown';
    }

    if (settings.processors) {
      // first shuffle the bin around so they can request .less and get the .css panel...yeah, funky
      // { html: 'markdown' }
      for (key in settings.processors) {
        if (settings.processors.hasOwnProperty(key)) {
          reverseProcessorLookup[settings.processors[key]] = key;
        }
      }

      // if we want the raw preprocessed content, just map
      if (reverseProcessorLookup[format]) {
        req.bin[format] = req.bin[reverseProcessorLookup[format]];
      } else if (settings.processors[format]) {
        // else we need to convert and process the source
        if (processors[settings.processors[format]] !== undefined) {
          req.bin[format] = processors[settings.processors[format]](req.bin[format]);
          // this delete ensures it doesn't happen again (in case we're looking at .html)
          delete req.bin.settings.processors[format];
        }
      }
    }

    res.contentType(format);
    if (format !== 'html') {
      res.send(req.bin[format]);
    } else {
      this.getBinPreview(req, res);
    }
  },
  getUserBins: function (req, res, next) {
    var _this = this;
    if (!req.session.user) {
      return res.send('');
    }

    this.models.user.getBins(req.session.user.name, function (err, bins) {
      if (err) {
        return next(err);
      }

      _this.renderHistory(req, res, bins);
    });
  },
  getLatestForUser: function (req, res, next) {
    var _this = this;

    if (!req.user) {
      return next(new errors.NotFound('User not found'));
    }

    this.models.user.getLatestBin(req.user.name, function (err, bin) {
      if (err) {
        return next(err);
      }

      if (bin.active) {
        req.bin = bin;
        next();
      } else {
        next(new errors.NotFound('Bin has been banned'));
      }
    });
  },
  redirectToLatest: function (req, res) {
    var path = req.originalUrl.replace('latest', req.bin.revision);
    res.redirect(303, path);
  },
  createBin: function (req, res, next) {
    var params = utils.extract(req.body, 'html', 'css', 'javascript', 'settings'),
        _this  = this;

    this.validateBin(params, function (err) {
      if (err) {
        return next(err);
      }

      _this.models.bin.create(params, function (err, result) {
        if (err) {
          return next(err);
        }

        _this.completeCreateBin(result, req, res, next);
      });
    });
  },
  claimBin: function (req, res, next) {
    // Handler for ambiguous endpoint that can be used to create a new bin with
    // a provided bin url, clone the bin and create a new endpoint or update an
    // existing one with no revision.  We use :url instead of :bin in the route
    // to prevent 404ing on a bin to be created.
    if (req.param('method') === 'save') {
      req.bin = {url: req.param('url'), revision: 0};
      return this.createRevision(req, res, next);
    }

    // If we're not claiming a new url then it's either a simple revision
    // or a clone. We pass this on to the next route which should use
    // .createRevisionOrClone() and :bin in the route segment to load the bin.
    next();
  },
  createRevisionOrClone: function (req, res, next) {
    // Another endpoint that does two things based on the content of the
    // POST body. Need to check for "new" in the method which is "clone".
    if (req.param('method', '').indexOf('new') > -1) {
      this.createBin(req, res, next);
    } else {
      this.createRevision(req, res, next);
    }
  },
  createRevision: function (req, res, next) {
    var panel  = req.param('panel'),
        params = {},
        _this  = this;

    if (req.param('method') === 'save') {
      params = utils.extract(req.body, 'html', 'css', 'javascript', 'settings');
      params.url = req.bin.url;
      params.revision = req.bin.revision + 1;
      params.summary = utils.titleForBin(params);

      this.validateBin(params, function (err) {
        if (err) {
          return next(err);
        }

        _this.models.bin.createRevision(params, function (err, result) {
          if (err) {
            return next(err);
          }

          _this.completeCreateBin(result, req, res, next);
        });
      });
    } else if (req.param('method') === 'update') {
      params[panel] = req.param('content');
      params.streamingKey = req.param('checksum');
      params.revision = req.param('revision');
      params.url = req.param('code');
      params.settings = req.param('settings');
      params.summary = utils.titleForBin(params);
      params.panel = panel;
      params.panel_open = !!params[panel];

      this.validateBin(params, function (err) {
        if (err) {
          return next(err);
        }

        _this.models.bin.updatePanel(panel, params, function (err, result) {
          if (err) {
            return next(err);
          }

          if (req.session.user) {
            _this.models.user.updateOwners(req.session.user.name, params, function () {});
            _this.emit('latest-for-user', req.session.user.name, req.bin);
          }

          _this.emit('updated', req.bin, {
            panelId: panel,
            content: params[panel]
          });

          res.json({ok: true, error: false});
        });
      });
    } else {
      next();
    }
  },
  reload: function (req, res, next) {
    var params = {},
        _this = this;

    params.streamingKey = req.param('checksum');
    params.revision = req.param('revision');
    params.url = req.param('code');

    this.validateBin(params, function (err) {
      if (err) {
        return next(err);
      }

      if (req.session.user) {
        _this.models.user.touchOwners(req.session.user.name, params, function () {});
        _this.emit('latest-for-user', req.session.user.name, req.bin);
      }

      _this.emit('reload', req.bin);

      res.json({ok: true, error: false});
    });
  },
  completeCreateBin: function (bin, req, res, next) {
    var _this  = this;

    if (!bin.summary) bin.summary = utils.titleForBin(bin);

    function render() {
      _this.emit('created', req.bin);
      _this.renderCreated(req, res, bin);
    }

    // If we have a logged in user then assign the bin to them.
    if (req.session.user && req.session.user.name) {
      _this.models.user.setBinOwner(req.session.user.name, bin, function (err) {
        if (err) {
          return next(err);
        }
        render();
      });
    } else {
      render();
    }
  },
  downloadBin: function (req, res, next) {
    var bin = req.bin,
        filename = ['jsbin', bin.url, bin.revision, 'html'].join('.'),
        options  = {analytics: false, edit: false, silent: true};

    this.formatPreview(bin, options, function (err, formatted) {
      if (err) {
        next(err);
      }

      res.header('Content-Disposition', 'attachment; filename=' + filename);

      if (formatted) {
        res.send(formatted);
      } else {
        res.contentType('js');
        res.send(bin.javascript);
      }
    });
  },
  notFound: function (req, res, next) {
    var files = this.defaultFiles(),
        _this = this;

    files[0] = 'not_found.html';
    files[2] = 'not_found.js';

    this.loadFiles(files, function (err, results) {
      if (err) {
        return next(err);
      }

      results.url = req.param('bin');

      // Need to get the most recent revision from the database.
      _this.models.bin.latest({id: results.url}, function (err, bin) {
        if (err) {
          return next(err);
        }

        // We have a missing bin, we check the latest returned bin, if this
        // is active then we simply render it assuming the user mistyped the
        // url.
        if (bin && bin.active) {
          results = bin;
        } else {
          // If we have a bin then take the latest revision plus one.
          results.revision = bin && (bin.revision + 1);
        }

        if (req.url.indexOf('edit') > -1) {
          _this.render(req, res, results);
        } else {
          var options = {edit: true, silent: true, csrf: req.session._csrf};
          _this.formatPreview(results, options, function (err, formatted) {
            if (err) {
              next(err);
            }

            if (formatted) {
              res.send(formatted);
            } else {
              res.contentType('js');
              res.send(req.bin.javascript);
            }
          });
        }
      });
    });
  },
  loadBin: function (req, res, next) {
    var rev    = parseInt(req.params.rev, 10) || 1,
        query  = {id: req.params.bin, revision: rev},
        helpers = this.helpers;

    function complete(err, result) {
      if (err) {
        return next(err);
      }

      if (!result) {
        return next(new errors.BinNotFound('Could not find bin: ' + req.params.bin));
      } else if (!result.active) {
        return next(new errors.NotFound('Bin has been reported: ' + req.params.bin));
      } else {
        req.bin = result;
        // manually add the full url to the bin to allow templates access
        req.bin.permalink = helpers.urlForBin(req.bin, true);
        next();
      }
    }

    // TODO: Re-factor this logic.
    if ((req.params.rev || req.path.indexOf('latest') === -1) && req.path.indexOf('save') === -1) {
      this.models.bin.load(query, complete);
    } else {
      this.models.bin.latest(query, complete);
    }
  },
  validateBin: function (bin, fn) {
    var reserved = this.helpers.set('reserved') || [];

    if (!blacklist.validate(bin)) {
      fn(new errors.BadRequest('Unable to save: Post contains blacklisted content'));
    } else if (bin.url && reserved.length && reserved.indexOf(bin.url) > -1) {
      fn(new errors.BadRequest('Unable to save: This is a reserved url'));
    } else {
      fn();
    }
  },
  render: function (req, res, bin, config) {
    var template = this.templateFromBin(bin),
        helpers = this.helpers,
        version = helpers.production ? helpers.set('version') : 'debug',
        created = req.flash('checksum') || {},
        root = helpers.url('', true),
        _this = this,
        jsbin;

    // Insert the subdomain if the request has one. Ideally this should be
    // done by the helper.url() function but it's not currently aware of the
    // request object.
    if (req.subdomain && custom[req.subdomain]) {
      root = root.replace('://', '://' + req.subdomain + '.');
    }

    jsbin = this.jsbin(bin, {
      version: version,
      token: req.session._csrf,
      root: root,
      static: helpers.urlForStatic(),
      settings: config && config.settings,
      // If we've pulled a just created bin out of the flash messages object
      // then we check to see if the previously created bin is the one we're
      // about to load. If so we add the checksum to the page which allows
      // the spike logic to work in IE8.
      checksum: created.url === bin.url && created.revision === bin.revision && created.checksum
    });

    // TODO I guess this isn't the clean way of doing this? -- RS
    if (req.live || req.embed) {
      jsbin.saveDisabled = true;
    }

    if (req.embed) {
      jsbin.embed = true;
    }

    helpers.analytics(function (err, analytics) {
      var url = helpers.urlForBin(bin),
          user = req.session.user || {};

      res.render('index', {
        tips: '{}',
        revision: bin.revision || 1,
        home:  user.name || null,
        email: user.email || null,
        flash_info: req.flash(req.flash.INFO),
        gravatar: user.avatar,
        jsbin: JSON.stringify(jsbin),
        json_template: JSON.stringify(template).replace(/<\/script>/gi, '<\\/script>').replace(/<!--/g, '<\\!--'),
        version: jsbin.version,
        analytics: analytics,
        token: req.session._csrf,
        custom_css: config && config.css,
        scripts: helpers.production ? false : scripts,
        is_production: helpers.production,
        root: root,
        static: helpers.urlForStatic(),
        url: url,
        live: req.live,
        embed: req.embed,
        code_id: bin.url,
        code_id_path: url,
        code_id_domain: helpers.urlForBin(bin, true).replace(/^https?:\/\//, '')
      });
    });
  },
  renderFiles: function (req, res, files, url) {
    var _this = this;
    files = files || this.defaultFiles();
    this.loadFiles(files, function (err, results) {
      if (!err) {
        results.url = url;
        _this.render(req, res, results);
      } else {
        res.send(500, 'Unable to read file');
      }
    });
  },
  renderCreated: function (req, res, bin) {
    var permalink = this.helpers.urlForBin(bin, true),
        editPermalink = this.helpers.editUrlForBin(bin);

    if (req.ajax) {
      if (req.param('format', '').toLowerCase() === 'plain') {
        return res.contentType('txt').send(this.helpers.editUrlForBin(bin, true));
      }

      var root = this.helpers.set('url full');
      // Insert the subdomain if the request has one. Ideally this should be
      // done by the helper.url() function but it's not currently aware of the
      // request object.
      if (req.subdomain && custom[req.subdomain]) {
        root = root.replace('://', '://' + req.subdomain + '.');
        permalink = permalink.replace('://', '://' + req.subdomain + '.');
      }


      res.json({
        code: bin.url,
        root: root,
        created: (new Date()).toISOString(), // Should be part of bin.
        revision: bin.revision,
        url: permalink,
        edit: editPermalink,
        html: editPermalink,
        js: editPermalink,
        summary: utils.titleForBin(bin),
        allowUpdate: !!bin.streamingKey,
        checksum: bin.streamingKey
      });
    } else {
      // Pass the bin id through in a flash message so that IE can get
      // the checksum after the redirect.
      res.flash('checksum', {url: bin.url, revision: bin.revision, checksum: bin.streamingKey});
      res.redirect(303, editPermalink);
    }
  },
  renderHistory: function (req, res, bins) {
    var acceptsJSON = req.header('Accept', '').indexOf('application/json') > -1,
        format = acceptsJSON ? 'json' : 'html';

    this.formatHistory(bins, format, function (err, history) {
      res.send(history);
    });
  },
  jsbin: function (bin, options) {
    return {
      root: options.root,
      static: options.static || options.root,
      version: options.version,
      state: {
        token: options.token,
        stream: false,
        code: bin.url || null,
        revision: bin.url ? (bin.revision || 1) : null,
        processors: bin.settings.processors || {},
        checksum: options.checksum || null
      },
      settings: options.settings || {panels: []}
    };
  },
  templateFromBin: function (bin) {
    var template = utils.extract(bin, 'html', 'css', 'javascript');

    'html css javascript'.split(' ').forEach(function (panel) {
      template[panel] = utils.cleanForRender(template[panel] || '');
    });

    template.url = this.helpers.jsbinURL(bin); //.permalink;
    return template;
  },
  defaultFiles: function () {
    return ['html', 'css', 'js'].map(function (ext) {
      return 'default.' + ext;
    });
  },
  loadFiles: function (files, fn) {
    files = files || this.defaultFiles();

    async.files(files, this.helpers.set('views')).readFile("utf8").toArray(function (err, results) {
      if (!err) {
        fn(null, {
          html: results[0].data,
          css: results[1].data,
          javascript: results[2].data,
          settings: {}
        });
      } else {
        fn(err);
      }
    });
  },
  formatPreview: function (bin, options, fn) {
    (function () {
      if (bin.settings && bin.settings.processors) {
        for (var panel in bin.settings.processors) {
          var processorName = bin.settings.processors[panel],
              processor = processors[processorName],
              code = bin[panel];
          if (processor) {
            bin['original_' + panel] = code;
            bin[panel] = processor(code);
          }
        }
      }
    })();

    var formatted = bin.html || '',
        helpers = this.helpers,
        insert = [],
        scripts = [],
        _this = this,
        parts, last, context;

    options = options || {};

    function onAnalyticsComplete(err, analytics) {
      if (err) {
        return fn(err);
      }

      // Insert JS at %code% or as the first script
      if (formatted.indexOf('%code%') > -1) {
        formatted = formatted.replace(/%code%/g, bin.javascript);
      } else {
        insert.push('<script>', bin.javascript.trim(), '</script>');
      }

      // Include 'Edit in JS Bin' button
      if (options.edit) {
        var data = {root: helpers.urlForStatic(''), csrf: options.csrf};
        insert.push('<script src="' + helpers.urlForStatic('js/render/edit.js') + '"></script>');
        insert.push('<script>jsbinShowEdit(' +  JSON.stringify(data) + ');</script>');
      }

      // Trigger an event to allow listeners to apply scripts to the page.
      // Scripts will be passed to helpers.urlForStatic() if no protocol is present.
      if (!options.silent) {
        _this.emit('render-scripts', scripts);
        insert = insert.concat(scripts.map(function (script) {
          script = script.indexOf('http') === 0 ? script : helpers.urlForStatic(script);
          return '<script src="' + script + '"></script>';
        }));
      }

      // Analytics
      if (options.silent !== true && helpers.production && analytics) {
        insert.push(analytics);
      }

      // Add CSS at %css% or find a place for it
      if (formatted.indexOf('%css%') > -1) {
        formatted = formatted.replace(/%css%/g, bin.css || '');
      } else {
        css = '\n<style id="jsbin-css">\n' + (bin.css || '') + '\n</style>';
        parts = formatted.split('</head>');
        last  = parts.pop();
        if (parts.length > 0) {
          // Add it just after before the end head tag if we can
          formatted = parts.join('</head>') + css + '\n</head>' + last;
        } else {
          // No <head>, now try just after </title>
          parts = formatted.split('</title>');
          last  = parts.pop();
          if (parts.length > 0) {
            formatted = parts.join('</title>') + '</title>' + css + last;
          } else {
            // Otherwise add it as the first script
            insert.unshift(css);
          }
        }
      }

      // Append scripts to the bottom of the page.
      if (insert.length) {
        parts = formatted.split('</body>');
        last  = parts.pop();
        if (parts.length > 0) {
          // Add the scripts just before the end body tag if there is one
          formatted = parts.join('</body>') + insert.join('\n') + '\n</body>' + last;
        } else {
          // Otherwise just shove 'em at the end
          formatted = last + '\n\n' + insert.join('\n');
        }
      }

      context = {
        domain: helpers.set('url host'),
        permalink: helpers.editUrlForBin(bin, true)
      };

      // Append attribution comment to header.
      helpers.render('comment', context, function (err, comment) {
        formatted = formatted.replace(/<html[^>]*>/, function ($0) {
          return $0 + '\n' + (comment || '').trim();
        });
        return fn(err || null, err ? undefined : formatted);
      });
    }

    // TODO: Re implement this entire block with an HTML parser.
    if (formatted) {
      if (options.analytics !== false) {
        helpers.analytics(onAnalyticsComplete);
      } else {
        onAnalyticsComplete();
      }
    } else {
      fn(null, formatted);
    }
  },
  formatHistory: function (bins, format, fn) {
    // reorder the bins based latest edited, and group by bin.url
    var helpers = this.helpers,
        order = {},
        urls = {},
        orderedBins, loopOrder, i, length;

    if (typeof format === 'function') {
      fn = format;
      format = 'html';
    }

    bins.forEach(function (bin) {
      var time = new Date(bin.last_updated).getTime();

      if (!urls[bin.url]) {
        urls[bin.url] = [];
      }

      urls[bin.url].push(bin);

      if (order[bin.url]) {
        if (order[bin.url] < time) {
          order[bin.url] = time;
        }
      } else {
        order[bin.url] = time;
      }
    });

    // Sort the revisions within the group
    Object.keys(urls).forEach(function (group) {
      urls[group].sort(function (a, b) {
        var a_time = new Date(a.last_updated).getTime(),
            b_time = new Date(b.last_updated).getTime();
        return a_time == b_time ? 0 : a_time < b_time ? -1 : 1;
      });
    });

    orderedBins = [];
    loopOrder = Object.keys(order).sort(function (a, b) {
      return order[a] < order[b] ? -1 : 1;
    });

    for (i = 0, length = loopOrder.length; i < length; i += 1) {
      orderedBins.push.apply(orderedBins, urls[loopOrder[i]]);
    }

    bins = orderedBins.reverse();

    this.loadFiles(null, function (err, defaults) {
      var map = {}, data = [], key;

      bins.forEach(function (bin) {
        var query = utils.queryStringForBin(bin, defaults),
            revisions = map[bin.url];

        if (!revisions) {
          revisions = map[bin.url] = [];
          data.push(revisions);
        }

        revisions.push({
          code: bin.url,
          revision: bin.revision,
          summary: bin.summary || '',
          url: helpers.urlForBin(bin),
          edit_url: helpers.editUrlForBin(bin) + '?' + query,
          last_updated: bin.last_updated.toISOString(),
          pretty_last_updated: utils.since(bin.last_updated),
          is_first: !map[bin.url].length
        });
      });

      if (format === 'json') {
        fn(null, data);
      } else { //if (format === 'html') {
        helpers.render('history', {bins: data}, fn);
      }
    });
  },
  report: function (req, res, next) {
    var bin = req.bin,
        _this = this;

    this.models.bin.report(bin, function (err) {
      if (err) {
        return next(err);
      }

      var to = _this.helpers.set('notify report'),
          context;

      context = {
        url: req.body.url,
        reportee: req.param('email', 'Anonymous'),
        from: req.body.email || null
      };

      if (_this.helpers.production && to && to.length) {
        _this.mailer.reportBin(to, context);
      }

      res.render('report', {
        root: _this.helpers.url(),
        dave: _this.helpers.urlForStatic('/images/logo.png')
      });

    });
  }
});
