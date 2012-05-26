var async      = require('asyncjs'),
    path       = require('path'),
    utils      = require('../utils'),
    errors     = require('../errors'),
    blacklist  = require('../blacklist'),
    Observable = utils.Observable;

module.exports = Observable.extend({
  constructor: function BinHandler() {
    Observable.apply(this, arguments);

    // For now we bind all methods to the class scope. In reality only those
    // used as route callbacks need to be bound.
    var methods = Object.getOwnPropertyNames(BinHandler.prototype).filter(function (prop) {
      return typeof this[prop] === 'function';
    }, this);

    utils.bindAll(this, methods);
  },
  getDefault: function (req, res) {
    this.renderFiles(req, res);
  },
  getBin: function (req, res, next) {
    this.render(req, res, req.bin);
  },
  getBinPreview: function (req, res, next) {
    var options = {edit: !req.param('quiet')};
    this.formatPreview(req.bin, req.helpers, options, function (err, formatted) {
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
  getUserBins: function (req, res, next) {
    if (!req.session.user) {
      return res.send('');
    }

    req.models.user.getBins(req.session.user.name, function (err, bins) {
      if (err) {
        return next(err);
      }

      this.renderHistory(req, res, bins);
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

      req.models.bin.create(params, function (err, result) {
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

        req.models.bin.createRevision(params, function (err, result) {
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

        req.models.bin.updatePanel(panel, params, function (err, result) {
          if (err) {
            return next(err);
          }
          res.json({ok: true, error: false});
        });
      });
    } else {
      next();
    }
  },
  completeCreateBin: function (bin, req, res, next) {
    var render = this.renderCreated.bind(this, req, res, bin);

    // If we have a logged in user then assign the bin to them.
    if (req.session.user && req.session.user.name) {
      req.models.user.assignBin(req.session.user.name, bin, function (err) {
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
        options  = {analytics: false, edit: false};

    this.formatPreview(bin, req.helpers, options, function (err, formatted) {
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
        query  = {id: req.params.bin, revision: rev};

    function complete(err, result) {
      if (err) {
        return next(new errors.NotFound('Could not find bin: ' + req.params.bin));
      } else {
        req.bin = result;
        // manually add the full url to the bin to allow templates access
        req.bin.permalink = req.helpers.urlForBin(req.bin, true);
        next();
      }
    }

    // TODO: Re-factor this logic.
    if ((req.params.rev || req.path.indexOf('latest') === -1) && req.path.indexOf('save') === -1) {
      req.models.bin.load(query, complete);
    } else {
      req.models.bin.latest(query, complete);
    }
  },
  validateBin: function (bin, fn) {
    if (!blacklist.validate(bin)) {
      fn(new errors.BadRequest('Unable to save: Post contains blacklisted content'));
    } else {
      fn();
    }
  },
  render: function (req, res, bin) {
    var template = this.templateFromBin(bin),
        helpers = req.helpers,
        version = helpers.production ? helpers.set('version') : 'debug',
        jsbin = this.jsbin(bin, version, req.session._csrf, helpers.set('url full')),
        _this = this;

    function onComplete(err, history) {
      req.helpers.analytics(function (err, analytics) {
        res.render('index', {
          tips: '{}',
          revision: bin.revision || 1,
          home: req.session.user ? req.session.user.name : null,
          jsbin: JSON.stringify(jsbin),
          json_template: JSON.stringify(template),
          version: jsbin.version,
          analytics: analytics,
          token: req.session._csrf,
          url: req.path,
          list_history: history || '',
          'production?': req.helpers.production
        });
      });
    }

    if (req.session.user) {
      req.models.user.getBins(req.session.user.name, function (err, bins) {
        if (err) {
          return onComplete(err);
        }

        _this.formatHistory(bins, req.helpers, onComplete);
      });
    } else {
      onComplete();
    }
  },
  renderFiles: function (req, res, files) {
    var _this = this;
    files = files || this.defaultFiles();
    this.loadFiles(files, req.helpers, function (err, results) {
      if (!err) { // FIXME - if there's an error - this will hang the connection
        _this.render(req, res, results);
      }
    });
  },
  renderCreated: function (req, res, bin) {
    var permalink = req.helpers.urlForBin(bin),
        editPermalink = req.helpers.editUrlForBin(bin);

    if (req.ajax) {
      if (req.param('format', '').toLowerCase() === 'plain') {
        return res.contentType('txt').send(req.helpers.editUrlForBin(bin, true));
      }

      res.json({
        code: bin.url,
        root: req.helpers.set('url full'),
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
      res.redirect(303, req.helpers.url(bin.url + '/' + bin.revision + '/edit'));
    }
  },
  renderHistory: function (req, res, bins) {
    this.formatHistory(bins, req.helpers, function (err, history) {
      res.send(history);
    });
  },
  jsbin: function (bin, version, token, root) {
    return {
      root: root,
      version: version,
      state: {
        token: token,
        stream: false,
        code: bin.url || null,
        revision: bin.revision || 1
      }
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
  loadFiles: function (files, helpers, fn) {
    files = files || this.defaultFiles();
    async.files(files, helpers.set('views')).readFile("utf8").toArray(function (err, results) {
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
  formatPreview: function (bin, helpers, options, fn) {
    var formatted = bin.html || '',
        insert = [], parts, last, context;

    function onAnalyticsComplete(err, analytics) {
      if (err) {
        return fn(err);
      }

      if (formatted.indexOf('%code%') > -1) {
        formatted = formatted.replace(/%code%/g, bin.javascript);
      } else {
        insert.push('<script>', bin.javascript.trim(), '</script>');
      }

      if (!options || options.edit !== false) {
        insert.push('<script src="' + helpers.url('/js/render/edit.js') + '"></script>');
      }

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
        insert = '<style>' + (bin.css || '') + '</style>';
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
  formatHistory: function (bins, helpers, fn) {
    // reorder the bins based latest edited, and group by bin.url
    var order = {},
        urls = {};

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

    var orderedBins = [],
        loopOrder = Object.keys(order).sort(function (a, b) {
          return order[a] < order[b] ? -1 : 1;
        });

    for (var i = 0; i < loopOrder.length; i++) {
      orderedBins.push.apply(orderedBins, urls[loopOrder[i]]);
    }

    bins = orderedBins.reverse();

    this.loadFiles(null, helpers, function (err, defaults) {
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
