var async      = require('asyncjs'),
    path       = require('path'),
    crypto     = require('crypto'),
    utils      = require('../utils'),
    errors     = require('../errors'),
    custom     = require('../custom'),
    blacklist  = require('../blacklist'),
    scripts    = require('../../scripts.json'),
    Observable = utils.Observable;

module.exports = Observable.extend({
  constructor: function BinHandler(sandbox) {
    Observable.apply(this, arguments);

    this.models = sandbox.models;
    this.helpers = sandbox.helpers;

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
  getLiveEditBin: function (req, res, next) {
    req.live = true;
    this.render(req, res, req.bin);
  },
  getBinPreview: function (req, res, next) {
    var options = {edit: !req.param('quiet'), silent: !!req.param('quiet')};
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
    var format = req.params.format;

    res.contentType(format);
    if (format !== 'html') {
      if (format === 'js' || format === 'json') {
        format = 'javascript';
      }
      res.send(req.bin[format]);
    } else {
      this.getBinPreview(req, res);
    }
  },
  // FIXME @aron - is this actually used anywhere - the `this.renderHistory` looks like it'll fail
  getUserBins: function (req, res, next) {
    if (!req.session.user) {
      return res.send('');
    }

    this.models.user.getBins(req.session.user.name, function (err, bins) {
      if (err) {
        return next(err);
      }

      this.renderHistory(req, res, bins);
    });
  },
  getLatestForUser: function (req, res, next) {
    var _this = this;

    if (!req.user) {
      return next(404);
    }

    this.models.user.getLatestBin(req.user.name, function (err, bin) {
      if (err) {
        return next(err);
      }

      req.bin = bin;

      next();
    });
  },
  redirectToLatest: function (req, res) {
    var path = req.originalUrl.replace('latest', req.bin.revision);
    res.redirect(303, path);
  },
  createBin: function (req, res, next) {
    var params = utils.extract(req.body, 'html', 'css', 'javascript'),
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
  createRevision: function (req, res, next) {
    var panel  = req.param('panel'),
        params = {},
        _this  = this;

    if (req.param('method') === 'save') {
      params = utils.extract(req.body, 'html', 'css', 'javascript');
      params.url = req.bin.url;
      params.revision = req.bin.revision + 1;

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

      this.validateBin(params, function (err) {
        if (err) {
          return next(err);
        }

        _this.models.bin.updatePanel(panel, params, function (err, result) {
          if (err) {
            return next(err);
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
  completeCreateBin: function (bin, req, res, next) {
    var _this  = this;

    function render() {
      _this.emit('created', req.bin);
      _this.renderCreated(req, res, bin);
    }

    // If we have a logged in user then assign the bin to them.
    if (req.session.user && req.session.user.name) {
      _this.models.user.assignBin(req.session.user.name, bin, function (err) {
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
  notFound: function (req, res) {
    var files = this.defaultFiles();
    files[0] = 'not_found.html';
    files[2] = 'not_found.js';
    this.renderFiles(req, res, files);
  },
  loadBin: function (req, res, next) {
    var rev    = parseInt(req.params.rev, 10) || 1,
        query  = {id: req.params.bin, revision: rev},
        helpers = this.helpers;

    function complete(err, result) {
      if (err) {
        return next(new errors.NotFound('Could not find bin: ' + req.params.bin));
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
    if (!blacklist.validate(bin)) {
      fn(new errors.BadRequest('Unable to save: Post contains blacklisted content'));
    } else {
      fn();
    }
  },
  render: function (req, res, bin, config) {
    var template = this.templateFromBin(bin),
        helpers = this.helpers,
        version = helpers.production ? helpers.set('version') : 'debug',
        _this = this,
        jsbin,
        md5sum;

    jsbin = this.jsbin(bin, {
      version: version,
      token: req.session._csrf,
      root: helpers.set('url full'),
      settings: config && config.settings
    });

    if (req.session.user && req.session.user.email && !req.session.user.gravatar) {
      md5sum = crypto.createHash('md5');
      md5sum.update(req.session.user.email.toLowerCase().trim());
      req.session.user.gravatar = 'http://www.gravatar.com/avatar/' + md5sum.digest('hex') + '?s=26';
    }

    if (req.live) {
      jsbin.saveDisabled = true;
    }

    function onComplete(err, history) {
      helpers.analytics(function (err, analytics) {
        var url = helpers.urlForBin(bin);
        res.render('index', {
          tips: '{}',
          revision: bin.revision || 1,
          home: req.session.user ? req.session.user.name : null,
          email: req.session.user ? req.session.user.email : null,
          gravatar: req.session.user ? req.session.user.gravatar : null,
          jsbin: JSON.stringify(jsbin),
          json_template: JSON.stringify(template).replace(/<\/script>/gi, '<\\/script>'),
          version: jsbin.version,
          analytics: analytics,
          token: req.session._csrf,
          list_history: history || '',
          custom_css: config && config.css,
          scripts: helpers.production ? false : scripts,
          is_production: helpers.production,
          root: helpers.set('url full'),
          static: helpers.set('static url'),
          url: url,
          live: req.live,
          code_id: bin.url,
          code_id_path: url,
          code_id_domain: helpers.urlForBin(bin, true).replace(/^https?:\/\//, '')
        });
      });
    }

    if (req.session.user) {
      this.models.user.getBins(req.session.user.name, function (err, bins) {
        if (err) {
          return onComplete(err);
        }

        _this.formatHistory(bins, onComplete);
      });
    } else {
      onComplete();
    }
  },
  renderFiles: function (req, res, files) {
    var _this = this;
    files = files || this.defaultFiles();
    this.loadFiles(files, function (err, results) {
      if (!err) { // FIXME - if there's an error - this will hang the connection
        _this.render(req, res, results);
      }
    });
  },
  renderCreated: function (req, res, bin) {
    var permalink = this.helpers.urlForBin(bin),
        editPermalink = this.helpers.editUrlForBin(bin);

    if (req.ajax) {
      if (req.param('format', '').toLowerCase() === 'plain') {
        return res.contentType('txt').send(this.helpers.editUrlForBin(bin, true));
      }

      res.json({
        code: bin.url,
        root: this.helpers.set('url full'),
        created: (new Date()).toISOString(), // Should be part of bin.
        revision: bin.revision,
        url: permalink,
        edit: editPermalink,
        html: editPermalink,
        js: editPermalink,
        title: utils.titleForBin(bin),
        allowUpdate: !!bin.streamingKey,
        checksum: bin.streamingKey
      });
    } else {
      res.redirect(303, this.helpers.url(bin.url + '/' + bin.revision + '/edit'));
    }
  },
  renderHistory: function (req, res, bins) {
    this.formatHistory(bins, function (err, history) {
      res.send(history);
    });
  },
  jsbin: function (bin, options) {
    return {
      root: options.root,
      version: options.version,
      state: {
        token: options.token,
        stream: false,
        code: bin.url || null,
        revision: bin.url ? (bin.revision || 1) : null
      },
      settings: options.settings || {panels: []}
    };
  },
  templateFromBin: function (bin) {
    var template = utils.extract(bin, 'html', 'css', 'javascript');
    template.url = bin.permalink;
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
          javascript: results[2].data
        });
      } else {
        fn(err);
      }
    });
  },
  formatPreview: function (bin, options, fn) {
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

      if (formatted.indexOf('%code%') > -1) {
        formatted = formatted.replace(/%code%/g, bin.javascript);
      } else {
        insert.push('<script>', bin.javascript.trim(), '</script>');
      }

      if (options.edit !== false) {
        insert.push('<script src="' + helpers.url('js/render/edit.js') + '"></script>');
      }

      // Trigger an event to allow listeners to apply scripts to the page.
      // Scripts will be passed to helpers.url() if no protocol is present.
      if (options.silent !== true) {
        _this.emit('render-scripts', scripts);
        insert = insert.concat(scripts.map(function (script) {
          script = script.indexOf('http') === 0 ? script : helpers.url(script);
          return '<script src="' + script + '"></script>';
        }));
      }

      // Analytics should always come last.
      if (helpers.production && analytics) {
        insert.push(analytics);
      }

      // Append scripts to the bottom of the page.
      if (insert.length) {
        parts = formatted.split('</body>');
        last  = parts.pop();
        formatted = parts.join('</body>') + insert.join('\n') + '\n</body>' + last;
      }

      if (formatted.indexOf('%css%') > -1) {
        formatted = formatted.replace(/%css%/g, bin.css || '');
      } else {
        insert = '<style id="jsbin-css">' + (bin.css || '') + '</style>';
        parts = formatted.split('</head>');
        last  = parts.pop();
        formatted = parts.join('</head>') + insert + '</head>' + last;
      }

      context = {
        domain: helpers.set('url host'),
        permalink: helpers.editUrlForBin(bin, true)
      };

      // Append attribution comment to header.
      helpers.render('comment', context, function (err, comment) {
        formatted = formatted.replace(/<html[^>]*>/, function ($0) {
          return $0 + '\n' + comment.trim();
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
  formatHistory: function (bins, fn) {
    // reorder the bins based latest edited, and group by bin.url
    var helpers = this.helpers,
        order = {},
        urls = {},
        orderedBins, loopOrder, i, length;

    bins.forEach(function (bin) {
      var time = new Date(bin.created).getTime();

      if (!urls[bin.url]) {
        urls[bin.url] = [];
      }

      // make sure the order is latest at the top (so use unshift, instead of push)
      urls[bin.url].unshift(bin);

      if (order[bin.url]) {
        if (order[bin.url] < time) {
          order[bin.url] = time;
        }
      } else {
        order[bin.url] = time;
      }
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
          title: utils.titleForBin(bin),
          code: bin.url,
          revision: bin.revision,
          url: helpers.urlForBin(bin),
          edit_url: helpers.editUrlForBin(bin) + '?' + query,
          created: bin.created.toISOString(),
          pretty_created: utils.since(bin.created),
          is_first: !map[bin.url].length
        });
      });

      helpers.render('history', {bins: data}, fn);
    });
  }
});
