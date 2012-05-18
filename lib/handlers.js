var async  = require('asyncjs'),
    path   = require('path'),
    utils  = require('./utils'),
    errors = require('./errors'),
    handlers;

module.exports = handlers = {
  getDefault: function (req, res) {
    handlers.renderFiles(req, res);
  },
  getBin: function (req, res, next) {
    handlers.render(req, res, req.bin);
  },
  getBinPreview: function (req, res, next) {
    var options = {edit: !req.param('quiet')};
    handlers.formatPreview(req.bin, req.helpers, options, function (err, formatted) {
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
    var output = JSON.stringify(handlers.templateFromBin(req.bin));
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
      handlers.getBinPreview(req, res);
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
      handlers.renderHistory(req, res, bins);
    });
  },
  redirectToLatest: function (req, res) {
    var path = req.originalUrl.replace('latest', req.bin.revision);
    res.redirect(303, path);
  },
  createBin: function (req, res, next) {
    var data = utils.extract(req.body, 'html', 'css', 'javascript');

    req.models.bin.create(data, function (err, result) {
      if (err) {
        return next(err);
      }

      var render = handlers.renderCreated.bind(handlers, req, res, result);

      // If we have a logged in user then assign the bin to them.
      if (req.session.user && req.session.user.name) {
        req.models.user.assignBin(req.session.user.name, result, function (err) {
          if (err) {
            return next(err);
          }
          render();
        });
      } else {
        render();
      }
    });
  },
  createRevision: function (req, res, next) {
    var panel  = req.param('panel'),
        params = {};

    if (req.param('method') === 'save') {
      params = utils.extract(req.body, 'html', 'css', 'javascript');
      params.url = req.bin.url;
      params.revision = req.bin.revision + 1;
      req.models.bin.createRevision(params, function (err, result) {
        if (err) {
          return next(err);
        }
        handlers.renderCreated(req, res, result);
      });
    } else if (req.param('method') === 'update') {
      params[panel] = req.param('content');
      params.streamingKey = req.param('checksum');
      params.revision = req.param('revision');
      params.url = req.param('code');

      req.models.bin.updatePanel(panel, params, function (err, result) {
        if (err) {
          return next(err);
        }
        res.json({ok: true, error: false});
      });
    } else {
      next();
    }
  },
  notFound: function (req, res) {
    var files = handlers.defaultFiles();
    files[0] = 'not_found.html';
    files[2] = 'not_found.js';
    handlers.renderFiles(req, res, files);
  },
  loadBin: function (req, res, next) {
    var rev    = parseInt(req.params.rev, 10) || 1,
        query  = {id: req.params.bin, revision: rev};

    function complete(err, result) {
      if (err) {
        return next(new errors.NotFound('Could not find bin: ' + req.params.bin));
      } else {
        req.bin = result;
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
  render: function (req, res, bin) {
    var template = handlers.templateFromBin(bin),
        jsbin = handlers.jsbin(bin, req.helpers.production ? req.helpers.set('version') : 'debug', req.session._csrf);

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
        handlers.formatHistory(bins, req.helpers, onComplete);
      });
    } else {
      onComplete();
    }
  },
  renderFiles: function (req, res, files) {
    files = files || handlers.defaultFiles();
    async.files(files, req.helpers.set('views')).readFile("utf8").toArray(function (err, results) {
      if (!err) {
        handlers.render(req, res, {
          html: results[0].data,
          css: results[1].data,
          javascript: results[2].data
        });
      }
    });
  },
  renderCreated: function (req, res, bin) {
    var permalink = req.helpers.urlForBin(bin),
        editPermalink = req.helpers.editUrlForBin(bin);

    if (req.ajax) {
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
    handlers.formatHistory(bins, req.helpers, function (err, history) {
      res.send(history);
    });
  },
  jsbin: function (bin, version, token) {
    return {
      root: '',
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
    return utils.extract(bin, 'html', 'css', 'javascript');
  },
  defaultFiles: function () {
    return ['html', 'css', 'js'].map(function (ext) {
      return 'default.' + ext;
    });
  },
  formatPreview: function (bin, helpers, options, fn) {
    var formatted = bin.html || '',
        insert = [], parts, last, context;

    // TODO: Re implement this entire block with an HTML parser.
    if (formatted) {
      helpers.analytics(function (err, analytics) {
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

        if (helpers.production) {
          insert.push(analytics);
        }

        // Append scripts to the bottom of the page.
        if (insert.length) {
          parts = formatted.split('</body>');
          last  = parts.pop();
          formatted = parts.join('</body>') + insert.join('\n') + '\n</body>' + last;
        }

        if (formatted.indexOf('%css%') > -1) {
          formatted = formatted.replace(/%css%/g, bin.css);
        } else {
          insert = '<style>' + bin.css + '</style>';
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
      });
    } else {
      fn(null, formatted);
    }
  },
  formatHistory: function (bins, helpers, fn) {
    var map = {}, data = [], key;

    bins.forEach(function (bin) {
      if (!map[bin.url]) {
        map[bin.url] = [];
      }

      map[bin.url].push({
        title: utils.titleForBin(bin),
        code: bin.url,
        revision: bin.revision,
        url: helpers.urlForBin(bin),
        edit_url: helpers.editUrlForBin(bin),
        created: bin.created.toISOString(),
        pretty_created: utils.since(bin.created),
        is_first: !map[bin.url].length
      });
    });

    for (key in map) {
      if (map.hasOwnProperty(key)) {
        data.push(map[key]);
      }
    }

    helpers.render('history', {bins: data}, fn);
  }
};
