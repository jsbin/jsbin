var async = require('asyncjs'),
    path  = require('path'),
    utils = require('./utils'),
    createBinModel = require('./models/bin');

// Create a not found error object.
function NotFound() {
  Error.apply(this, arguments);
}
NotFound.prototype = Object.create(Error.prototype);

module.exports = function (app) {
  var binModel = createBinModel(app.store), handlers;

  handlers = {
    getDefault: function (req, res) {
      handlers.renderFiles(req, res);
    },
    getBin: function (req, res, next) {
      handlers.render(req, res, req.bin);
    },
    getBinPreview: function (req, res, next) {
      handlers.formatPreview(req.bin, {edit: true}, function (err, formatted) {
        if (err) {
          next(err);
        }

        // TODO: Implement "quiet" flag.
        if (formatted && false) {
          formatted += '';
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
    redirectToLatest: function (req, res) {
      var path = req.path.replace('latest', req.bin.revision);
      res.redirect(303, path);
    },
    createBin: function (req, res, next) {
      var data = utils.extract(req.body, 'html', 'css', 'javascript');

      binModel.create(data, function (err, result) {
        if (err) {
          return next(err);
        }
        handlers.renderCreated(req, res, result);
      });
    },
    createRevision: function (req, res, next) {
      var panel  = req.param('panel'),
          params = {};

      if (req.param('method') === 'save') {
        params = utils.extract(req.body, 'html', 'css', 'javascript');
        params.url = req.bin.url;
        params.revision = req.bin.revision + 1;
        binModel.createRevision(params, function (err, result) {
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

        binModel.updatePanel(panel, params, function (err, result) {
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
      files[2] = 'not_found.js';
      handlers.renderFiles(req, res, files);
    },
    loadBin: function (req, res, next) {
      var rev    = parseInt(req.params.rev, 10) || 1,
          query  = {id: req.params.bin, revision: rev};

      function complete(err, result) {
        if (err) {
          return next(new NotFound('Could not find bin: ' + req.params.bin));
        } else {
          req.bin = result;
          next();
        }
      }

      // TODO: Re-factor this logic.
      if ((req.params.rev || req.path.indexOf('latest') === -1) && req.path.indexOf('save') === -1) {
        binModel.load(query, complete);
      } else {
        binModel.latest(query, complete);
      }
    },
    render: function (req, res, bin) {
      var template = handlers.templateFromBin(bin),
          jsbin = handlers.jsbin(bin);

      res.render('index', {
        tips: '{}',
        revision: bin.revision || 1,
        jsbin: JSON.stringify(jsbin),
        json_template: JSON.stringify(template),
        version: jsbin.version
      });
    },
    renderFiles: function (req, res, files) {
      files = files || handlers.defaultFiles();
      async.files(files, app.set('views')).readFile("utf8").toArray(function (err, results) {
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
      var permalink = handlers.urlForBin(bin),
          editPermalink = handlers.editUrlForBin(bin);

      if (req.ajax) {
        res.json({
          code: bin.url,
          root: app.set('url full'),
          created: (new Date()).toISOString(), // Should be part of bin.
          revision: bin.revision,
          url: permalink,
          edit: editPermalink,
          html: editPermalink,
          js: editPermalink,
          title: utils.titleForBin(bin),
          allowUpdate: false,
          checksum: req.streamingKey
        });
      } else {
        res.redirect(303, '/' + bin.url + '/' + bin.revision + '/edit');
      }
    },
    jsbin: function (bin) {
      return {
        root: '',
        version: app.set('environment') === 'production' ? app.set('version') : 'debug',
        state: {
          stream: false,
          code: bin.url || null,
          revision: bin.revision || 1
        }
      };
    },
    urlForBin: function (bin, full) {
      return app.set(full ? 'url full' : 'url prefix') + bin.url + '/' + bin.revision;
    },
    editUrlForBin: function (bin, full) {
      return handlers.urlForBin(bin, full) + '/edit';
    },
    templateFromBin: function (bin) {
      return utils.extract(bin, 'html', 'css', 'javascript');
    },
    defaultFiles: function () {
      return ['html', 'css', 'js'].map(function (ext) {
        return 'default.' + ext;
      });
    },
    formatPreview: function (bin, options, fn) {
      var formatted = bin.html || '',
          insert = [], parts, last, context;

      // TODO: Re implement this entire block with an HTML parser.
      if (formatted) {
        if (formatted.indexOf('%code%') > -1) {
          formatted = formatted.replace(/%code%/g, bin.javascript);
        } else {
          insert.push('<script>', bin.javascript.trim(), '</script>');
        }

        if (!options || options.edit !== false) {
          insert.push('<script src="/js/render/edit.js"></script>');
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
          domain: app.get('url host'),
          permalink: handlers.editUrlForBin(bin, true)
        };

        // Append attribution comment to header.
        app.render('comment', context, function (err, comment) {
          formatted = formatted.replace(/<html[^>]*>/, function ($0) {
            return $0 + '\n' + comment.trim();
          });
          return fn(err || null, err ? undefined : formatted);
        });
      } else {
        fn(null, formatted);
      }
    },
    NotFound: NotFound
  };
  return handlers;
};
