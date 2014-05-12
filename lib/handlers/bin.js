'use strict';
var async      = require('asyncjs'),
    utils      = require('../utils'),
    errors     = require('../errors'),
    custom     = require('../custom'),
    blacklist  = require('../blacklist'),
    scripts    = require('../../scripts.json'),
    processors = require('../processors'),
    _          = require('underscore'),
    undefsafe  = require('undefsafe'),
    metrics    = require('../metrics'),
    features   = require('../features'),
    Promise    = require('rsvp').Promise,
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
    var processorTypes = 'jade markdown less stylus sass scss coffeescript processing traceur typescript jsx'.split(' '),
        aliases = processors.aliases,
        allTypes = ('html css javascript'.split(' ')).concat(processorTypes).concat(Object.keys(aliases));

    // JavaScript isn't a processor, so it's not included in the default aliases
    aliases.js = 'javascript';

    var processorSettings = {};

    var data = utils.extract.apply(null, [req.body].concat(allTypes));
    data.settings = {};

    allTypes.forEach(function (panel) {
      if (data[panel]) {
        // if an alias was used, then move it to the non alias version
        if (aliases[panel]) {
          data[aliases[panel]] = data[panel];
          panel = aliases[panel];
        }

        // if we're dealing with a processor in the posted data, then add it to
        // settings and move it to the correct panel name (ie. coffeescript => js)
        if (processorTypes.indexOf(panel) !== -1) {
          // mark this as a processor
          processorSettings[processors.lookup[panel]] = panel;

          // then change the panel name to match the actual panel, and let the
          // processor kick in during render
          data[processors.lookup[panel]] = data[panel];
          delete data[panel];
          panel = processors.lookup[panel];
        }
        data[panel] = decodeURIComponent(data[panel]);
      }
    });

    if (Object.keys(processorSettings).length) {
      data.settings.processors = processorSettings;
    }

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

      _this.render(req, res, defaults);
    });
  },
  getBin: function (req, res, next) {
    this.render(req, res, req.bin);
  },
  // creates a object that's API request friendly - ie. gets rendered
  // output if there's a processor and hides internal fields
  apiPrepareBin: function (bin) {
    var out = _.pick(bin,
      'html',
      'javascript',
      'css',
      'original_html',
      'original_javascript',
      'original_css',
      'created',
      'last_updated'
    );

    out.permalink = this.helpers.urlForBin(bin, true);

    if (bin.settings && bin.settings.processors) {
      out.processors = bin.settings.processors;
    }

    // note: if there's no processor, then the "original_*" fields

    return out;
  },
  loadBinRevision: function (req, res, next) {
    if (req.param('rev')) {
      next();
    } else {
      this.models.bin.latest({ id: req.bin.url, username: undefsafe(req, 'session.user.name') }, function(err, bin) {
        req.bin = bin;
        next();
      });
    }
  },
  apiGetBin: function (req, res, next) {
    this.applyProcessors(req.bin);
    res.json(this.apiPrepareBin(req.bin));
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
    // if we're loading a username/last(-:n)? and no 'n' is present
    // it breaks quiet, leaving it as undefined, here we manually
    // check for it and modify the req.params to reflect the url.
    // the reason we check for user name is so there aren't conflicts
    // loading a bin called quiet.
    if(req.params.username && req.url.indexOf('quiet') !== -1) {
      req.params.quiet = 'quiet';
    }
    var options = {
      edit: !req.param('quiet'),
      silent: !!req.param('quiet'),
      csrf: req.session._csrf
    };

    this.protectVisibility(req.session.user, req.bin, function(err, bin) {
      new Promise(function (resolve, reject) {
        // if there's a subdomain
        if (req.subdomain) {
          // TODO handle orgs here too
          // ignore orgs for now
          //
          // if the subdomain
          if (custom[req.subdomain]) {
            // custom domain
            resolve();
          } else if (req.subdomain !== undefsafe(bin, 'metadata.name')) {
            reject('username does not match');
          } else {
            if (features('vanity', { session: { user: bin.metadata }})) {
              resolve();
            } else {
              reject('vanity feature not enabled');
            }
          }
        } else {
          resolve();
        }
      }).then(function () {
        this.formatPreview(req.bin, options, function (err, formatted) {
          if (err) {
            next(err);
          }

          if (req.xhr) {
            res.json(this.apiPrepareBin(req.bin));
          } else if (formatted) {
            res.send(formatted);
          } else {
            res.contentType('js');
            res.send(req.bin.javascript);
          }
        }.bind(this));
      }.bind(this)).catch(function () {
        console.log.apply(console, [].slice.apply(arguments));
        res.redirect(this.helpers.url(req.url, true));
      }.bind(this));
    }.bind(this));
  },
  // TODO decide whether this is used anymore
  getBinSource: function (req, res) {
    this.protectVisibility(req.session.user, req.bin, function(err, bin){
      res.contentType('json');
      var output = JSON.stringify(this.templateFromBin(bin));
      if (!req.ajax) {
        res.contentType('js');
        output = 'var template = ' + output;
      }
      res.send(output);
    });
  },
  getBinSourceFile: function (req, res) {
    this.protectVisibility(req.session.user, req.bin, function(err, bin){
      var format = req.params.format,
          settings = bin.settings || {},
          reverseProcessorLookup = {},
          key,
          contentType = processors.mime[format] || processors.mime._default;

      // this doesn't do anything except tell you, the reader, what's going on.
      req.bin = bin;

      if (format === 'js' || format === 'json') {
        format = 'javascript';
        contentType = 'application/javascript';
      }

      if (format === 'md') {
        format = 'markdown';
      }

      if (format === 'coffee') {
        format = 'coffeescript';
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
          bin[format] = bin[reverseProcessorLookup[format]];
        } else if (settings.processors[format]) {
          // else we need to convert and process the source
          if (processors[settings.processors[format]] !== undefined) {
            bin[format] = processors[settings.processors[format]](bin[format]);
            // this delete ensures it doesn't happen again (in case we're looking at .html)
            delete bin.settings.processors[format];
          }
        }
      }

      if (format !== 'html') {
        res.contentType(contentType);
        res.send(req.bin[format]);
      } else {
        this.getBinPreview(req, res);
      }
    }.bind(this));
  },
  getUserBins: function (req, res, next) {
    var _this = this;
    if (!req.session.user && !req.params.user) {
      return res.send('');
    }

    // send first byte right away to help varnish know we are on it
    /*
    if (req.header('Accept', '').indexOf('application/json') > -1) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
    }
    */

    this.models.user.getBins(req.params.user || req.session.user.name, function (err, bins) {
      if (err) {
        // TODO handle unknown user
        return next(err);
      }

      // TODO handle private users

      _this.renderHistory(req, res, next, bins);
    });
  },
  getLatestForUser: function (req, res, next) {
    var _this = this;

    if (!req.user) {
      return next(new errors.NotFound('User not found'));
    }

    this.models.user.getLatestBin(req.user.name, req.params.n || 0, undefsafe(req, 'session.user.name'), function (err, bin) {
      if (err && err !== 401) {
        return next(err);
      }

      if (!bin || err === 401) {
        metrics.increment('bin.404');
        if (req.url.indexOf('/edit') !== -1) {
          var root = _this.helpers.url('', true);
          return res.redirect(root);
        }
        return next(new errors.BinNotFound('Could not find bin: ' + req.params.bin));
      } else if (!bin.active) {
        metrics.increment('bin.404-reported');
        return next(new errors.NotFound('Bin has been reported: ' + req.params.bin));
      } else {
        req.bin = bin;
        next();
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

      params.length = utils.binUrlLength(req);

      metrics.increment('bin.create');

      _this.models.bin.create(params, function (err, result) {
        if (err) {
          return next(err);
        }

        _this.completeCreateBin(result, req, res, next);
      });
    });
  },
  apiCreateBin: function (req, res, next) {
    var params = utils.extract(req.body, 'html', 'css', 'javascript', 'settings'),
        _this  = this;

    this.validateBin(params, function (err) {
      if (err) {
        return next(err);
      }

      params.settings = params.settings || '{ processors: {} }'; // set default processors
      params.length = utils.binUrlLength(req);
      _this.models.bin.create(params, function (err, result) {
        if (err) {
          return next(err);
        }

        _this.completeCreateBin(result, req, res, next, function() {
          res.json(result);
        });
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
  setBinAsPrivate: function(req, res, next) {
    if (!req.session.user || !req.session.user.pro) {
      return res.send(301);
    }
    this.models.bin.setBinVisibility(req.bin, req.session.user.name, 'private', function(err, bin){
      if (err) {
        res.send(err);
      }
      res.send(200, 'OK');
    });
  },
  setBinAsPublic: function(req, res, next) {
    if (!req.session.user || !req.session.user.pro) {
      return res.send(301);
    }
    this.models.bin.setBinVisibility(req.bin, req.session.user.name, 'public', function(err, bin){
      if (err) {
        res.send(err);
      }
      res.send(200, 'OK');
    });
  },
  apiCreateRevision: function (req, res, next) {
    var that = this,
        params = utils.extract(req.body, 'html', 'css', 'javascript', 'settings');

    params.url = req.params.bin;
    params.revision = parseInt(req.params.rev, 10) || req.bin.revision;
    params.settings = params.settings || '{ processors: {} }'; // set default processors
    params.summary = utils.titleForBin(params);

    this.validateBin(params, function (err) {
      if (err) {
        return next(err);
      }

      var username = req.session.user ? req.session.user.name : undefined;

      that.models.user.isOwnerOf(username, params, function (err, result) {
        var method = 'create';

        if (result.isowner || result.found === false) { // if anonymous or user is owner
          params.revision += 1; // bump the revision from the *latest*
          that.models.bin.createRevision(params, function (err, result) {
            var query = {id: req.params.bin, revision: result.revision};
            if (err) {
              return next(err);
            }

            that.models.bin.load(query, function (err, result) {
              if (err) {
                return next(err);
              }
              that.completeCreateBin(result, req, res, next, function() {
                res.json(result);
              });
            });
          });
        } else {
          res.status(403); // forbidden
          res.json({ error: 'You are not the owner of this bin so you cannot create a revision' });
        }
      });
    });
  },
  createRevision: function (req, res, next) {
    var panel  = req.param('panel'),
        params = {},
        handler  = this,
        models = this.models;

    if (req.param('method') === 'save') {
      params = utils.extract(req.body, 'html', 'css', 'javascript', 'settings');
      params.url = req.bin.url;
      params.revision = parseInt(req.params.rev, 10) || 1; //req.bin.revision;
      // Catch for when this is a claimed bin, with no metadata as it does not exist in the owners table yet.
      // We would put this in the :bin param but the claimBin uses :url to get around the error that would be thrown.
      params.visibility = req.bin.metadata ? req.bin.metadata.visibility : 'public';

      // this is the bin that will be *created*
      var bin = _.extend({}, req.bin || {}, params);
      params.summary = utils.titleForBin(bin);

      this.validateBin(params, function (err) {
        if (err) {
          return next(err);
        }

        var username = req.session.user ? req.session.user.name : undefined;

        handler.models.user.isOwnerOf(username, params, function (err, result) {
          var method = 'create';

          if (result.found && result.result.active === 'n') { // this is a deleted bin
            metrics.increment('bin.fork');
            delete params.revision;
          } else if (result.isowner || result.found === false) {
            metrics.increment('bin.create-revision');
            method = 'createRevision';
            params.revision = req.bin.revision + 1; // bump the revision from the *latest*
          } else {
            delete params.revision;
            metrics.increment('bin.fork');
          }

          params.length = utils.binUrlLength(req);

          handler.models.bin[method](params, function (err, result) {
            if (err) {
              return next(err);
            }

            // Notify interested parties (spike) that a new revision was created
            var oldBin = req.bin;
            handler.once('created', function (newBin) {
              handler.emit('new-revision', oldBin, newBin);
            });

            handler.completeCreateBin(result, req, res, next);
          });
        });
      });
    } else if (req.param('method') === 'update') {
      params[panel] = req.param('content');
      params.streamingKey = req.param('checksum');
      params.revision = req.param('revision');
      params.url = req.param('code');
      params.settings = req.param('settings');
      params.panel = panel;
      params.panel_open = !!params[panel];


      // this is the bin that will be *created*
      var bin = _.extend({}, req.bin || {}, params);

      // ensure our summary comes from the complete bin picture
      params.summary = utils.titleForBin(bin);

      this.validateBin(bin, function (err) {
        if (err) {
          return next(err);
        }

        metrics.increment('bin.update');

        handler.models.bin.updatePanel(panel, params, function (err, result) {
          if (err) {
            return res.json({ok:false, error: err});
            // return next(err);
          }

          if (req.session.user) {
            handler.models.user.updateOwners(req.session.user.name, params, function () {});
            handler.emit('latest-for-user', req.session.user.name, req.bin);
            models.bin.saveToDropbox(bin, req.session.user);
          }

          handler.emit('updated', req.bin, {
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

    // this is the bin that will be *created*
    var bin = _.extend({}, req.bin || {}, params);

    this.validateBin(bin, function (err) {
      if (err) {
        return next(err);
      }

      metrics.increment('spike.reload');

      if (req.session.user) {
        _this.models.user.touchOwners(req.session.user.name, params, function () {});
        _this.emit('latest-for-user', req.session.user.name, req.bin);
      }

      _this.emit('reload', req.bin);

      res.json({ok: true, error: false});
    });
  },
  completeCreateBin: function (bin, req, res, next, renderFn) {
    var _this  = this;

    if (!bin.summary) {
      bin.summary = utils.titleForBin(bin);
    }

    function render() {
      if (renderFn) {
        renderFn();
      } else {
        _this.emit('created', bin);
        _this.renderCreated(req, res, bin);
      }
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
    this.protectVisibility(req.session.user, req.bin, function(err, bin){

      var filename = ['jsbin', bin.url, bin.revision, 'html'].join('.'),
          options  = {analytics: false, edit: false, silent: true};

      this.formatPreview(bin, options, function (err, formatted) {
        if (err) {
          next(err);
        }

        metrics.increment('bin.download');

        res.header('Content-Disposition', 'attachment; filename=' + filename);

        if (formatted) {
          res.send(formatted);
        } else {
          res.contentType('js');
          res.send(bin.javascript);
        }
      });

    }.bind(this));
  },
  notFound: function (req, res, next) {
    var files = this.defaultFiles(),
        _this = this,
        errorMessage;

    files[0] = 'not_found.html';
    files[2] = 'not_found.js';

    if (req.isApi || req.ajax) {
      res.status(404);
      errorMessage = 'Could not find bin with ID "' + req.param('bin') + '"';
      if (req.param('rev')) { errorMessage += ' and revision ' + req.param('rev'); }
      res.json({ error: errorMessage });
    } else {
      this.loadFiles(files, function (err, results) {
        if (err) {
          return next(err);
        }

        results.url = req.param('bin');

        // Need to get the most recent revision from the database.
        _this.models.bin.latest({id: results.url, username: undefsafe(req, 'session.user.name') }, function (err, bin) {
          if (err === 401) { // not authorised
            bin = {};
            // so go ahead and completely reset the bin to a not found state
            bin.metadata = {};
            bin.html = results[0];
            bin.css = results[1];
            bin.javascript = results[2];
          } else if (err) {
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
                res.send(bin.javascript);
              }
            });
          }
        });
      });
    }
  },
  loadBin: function (req, res, next) {
    var rev    = parseInt(req.params.rev, 10) || 'latest',
        username = undefsafe(req, 'session.user.name'),
        query  = {id: req.params.bin, revision: rev, username: username },
        helpers = this.helpers,
        models = this.models;

    function complete(err, result) {
      if (err && err !== 401) {
        return next(err);
      }

      if (!result || err === 401) {
        metrics.increment('bin.404');
        return next(new errors.BinNotFound('Could not find bin: ' + req.params.bin));
      } else if (!result.active) {
        metrics.increment('bin.404-reported');
        return next(new errors.NotFound('Bin has been reported: ' + req.params.bin));
      } else {
        req.bin = result;
        // manually add the full url to the bin to allow templates access
        req.bin.permalink = helpers.urlForBin(req.bin, true);
        next();
      }
    }

    // TODO: Re-factor this logic.
    if (rev === 'latest' || req.path.indexOf('save') !== -1) {
      models.bin.latest(query, complete);
    } else {
      models.bin.load(query, complete);
    }
  },
  protectVisibility: function (user, bin, cb) {
    if (this.models.bin.isVisible(bin, undefsafe(user, 'name'))) {
      return cb(null, bin);
    }

    metrics.increment('bin.visibility.deined');
    this.loadFiles(this.defaultFiles(), function(err, files) {
      bin.javascript = files.javascript;
      bin.html = files.html;
      bin.css = files.css;
      cb(err, bin);
    });
  },
  validateBin: function (bin, fn) {
    var reserved = this.helpers.set('reserved') || [];

    var panels = 'html javascript css'.split(' ').map(function (key) {
      return (bin[key] || '').trim();
    }).filter(function (content) {
      return content.length;
    });

    if (!blacklist.validate(bin)) {
      metrics.increment('bin.validate.blacklisted');
      fn(new errors.BadRequest('Unable to save: Post contains blacklisted content'));
    } else if (bin.url && reserved.length && reserved.indexOf(bin.url) > -1) {
      metrics.increment('bin.validate.reserved');
      fn(new errors.BadRequest('Unable to save: This is a reserved url'));
    } else if (panels.length === 0) {
      metrics.increment('bin.validate.empty');
      fn(new errors.BadRequest('Unable to save: The bin has no content'));
    } else {
      fn();
    }
  },
  render: function (req, res, bin) {
    this.protectVisibility(req.session.user, bin, function(err, bin) {

      var template = this.templateFromBin(bin),
          config = custom[req.subdomain],
          helpers = this.helpers,
          version = helpers.set('version'),
          created = req.flash('checksum') || {},
          root = helpers.url('', true),
          _this = this,
          production = (req.cookies && req.cookies.debug) ? false : helpers.production,
          jsbin;

      // Insert the subdomain if the request has one. Ideally this should be
      // done by the helper.url() function but it's not currently aware of the
      // request object.
      if (req.subdomain && config) {
        root = root.replace('://', '://' + req.subdomain + '.');
      }

      jsbin = this.jsbin(bin, {
        version: version,
        token: req.session._csrf,
        root: root,
        shareRoot: features('vanity', req) ? 'http://' + req.session.user.name + '.' + req.app.get('url host') : root,
        metadata: bin.metadata,
        runner: helpers.runner,
        static: helpers.urlForStatic(),
        settings: !bin.url ? config && config.settings : {},
        // If we've pulled a just created bin out of the flash messages object
        // then we check to see if the previously created bin is the one we're
        // about to load. If so we add the checksum to the page which allows
        // the spike logic to work in IE8.
        checksum: created.url === bin.url && created.revision === bin.revision && created.checksum
      });

      // TODO I guess this isn't the clean way of doing this? -- RS
      // TODO WORK OUT WHETHER THIS IS NOT THE OWNER AND STREAMING
      if (req.live || req.embed || req.sandbox) {//} || (!jsbin.state.checksum && jsbin.state.streaming === true)) {
        jsbin.saveDisabled = true;
      }

      if (req.embed) {
        jsbin.embed = true;
      }

      if (req.sandbox) {
        jsbin.sandbox = true;
      }

      if (custom[req.subdomain]) {
        jsbin.custom = true;
      }

      jsbin.user = req.session.user || {};

      // as backup - i.e. the user has not refreshed their session and
      // req.session.user.settings === null - which we don't want.
      if (!undefsafe(jsbin, 'user.settings')) {
        jsbin.user.settings = {};
      }


      helpers.analytics(function (err, analytics) {
        var url = helpers.urlForBin(bin),
            user = req.session.user || {};

        var done = function () {
          // Sort out the tip
          var info = req.flash(req.flash.INFO),
              error = req.flash(req.flash.ERROR),
              notification = req.flash(req.flash.NOTIFICATION);

          var tip = error || notification || info,
              tipType = '';

          var addons = [];
          if (!production) {
            for (var prop in scripts.addons) {
              if (scripts.addons.hasOwnProperty(prop)) {
                addons = addons.concat(scripts.addons[prop]);
              }
            }
          }

          if (info) {tipType = 'info';}
          if (notification) {tipType = 'notification';}
          if (error) {tipType = 'error';}

          metrics.increment('bin.viewed');

          res.render('index', {
            request: req,
            tips: '{}',
            revision: bin.revision || 1,
            home:  user.name || null,
            email: user.email || null,
            pro: user.pro,
            private: bin.metadata ? bin.metadata.visibility === 'private' : false,
            user: user || null,
            flash_tip: tip,
            flash_tip_type: tipType,
            gravatar: user.avatar,
            large_gravatar: utils.gravatar(user.email, 120),
            jsbin: JSON.stringify(jsbin),
            json_template: JSON.stringify(template).replace(/<\/script>/gi, '<\\/script>').replace(/<!--/g, '<\\!--'),
            cacheBust: production ? '?' + version : '',
            analytics: analytics,
            token: req.session._csrf,
            custom_css: config && config.css,
            custom_js: config && config.js,
            scripts: production ? false : scripts.app,
            addons: production ? false : addons,
            isProduction: production,
            concat: req.cookies && req.cookies.debug ? req.cookies.debug === 'concat' : false,
            root: root,
            static: helpers.urlForStatic(),
            bincount: user.bincount,
            url: url,
            vanity: features('vanity', req) ? 'http://' + req.session.user.name + '.' + req.app.get('url host') : root,
            live: req.live,
            embed: req.embed,
            code_id: bin.url,
            code_id_path: url,
            code_id_domain: helpers.urlForBin(bin, true).replace(/^https?:\/\//, '')
          });
        };

        if (user) {
          _this.models.user.getBinCount(user.name, function (err, result) {
            user.bincount = result.total;
            done();
          });
        } else {
          done();
        }
      });
    }.bind(this));
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
  renderHistory: function (req, res, next, bins) {
    var accepts = req.header('Accept', '');

    if (accepts === undefined) {
      return next();
    }

    var acceptsJSON = req.header('Accept', '').indexOf('application/json') > -1,
        format = acceptsJSON ? 'json' : 'html',
        helpers = this.helpers,
        jsbin = JSON.stringify({ version: helpers.production ? helpers.set('version') : 'debug',
          root: helpers.url('', true),
          static: helpers.urlForStatic()
        });


    this.formatHistory(bins, format, function (err, history) {
      if (acceptsJSON) {
        res.send(history);
      } else {
        helpers.render('history', {
          bins: history,
          by_user: req.params.user ? ' by ' + req.params.user : ''
          },
          function (err, html) {
            if (req.ajax) {
              res.send(html);
            } else {
              res.render('list', { list_history: html,
                jsbin: jsbin,
                static: helpers.urlForStatic(),
                scripts: [ '/js/vendor/jquery-1.11.0.min.js',
                  '/js/vendor/pretty-date.js',
                  '/js/render/saved-history-preview.js'
                ],
                is_production: helpers.production
              });
            }
          });
      }
    });
  },
  jsbin: function (bin, options) {
    var panels = Object.keys(_.pick(bin, 'html', 'javascript', 'css')).filter(function (panel) {
      return !!bin[panel].trim();
    }).concat('live');

    if (!options.metadata) {
      options.metadata = {};
    }

    if (options.metadata.email) {
      options.metadata.avatar = utils.gravatar(options.metadata.email);
    }

    options.metadata = _.pick.apply(_, [options.metadata].concat('archive avatar created last_login name pro summary updated visibility'.split(' ')));

    // this value isn't always present in anonymous metadata
    options.metadata.last_updated = bin.created;

    return {
      root: options.root,
      shareRoot: options.shareRoot,
      runner: this.helpers.runner,
      static: options.static || options.root,
      version: options.version,
      state: {
        token: options.token,
        stream: false,
        streaming: this.models.bin.isStreaming(bin),
        code: bin.url || null,
        revision: bin.url ? (bin.revision || 1) : null,
        processors: bin.settings.processors || {},
        checksum: options.checksum || null,
        metadata: options.metadata,
      },
      settings: options.settings ? _.extend(options.settings, { panels: panels }) : { panels: panels }
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
  // applies the processors to the bin and generates the html, js, etc
  // based on the appropriate processor. Used in the previews and the API
  // requests.
  applyProcessors: function (bin) {
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

    // nothing returned as it updates the bin object
  },
  formatPreview: function (bin, options, fn) {
    metrics.increment('bin.rendered');
    this.applyProcessors(bin);

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
        var jsparts = formatted.split('%code%');
        formatted = jsparts.join(bin.javascript);
      } else {
        insert.push('<script>', bin.javascript.trim(), '</script>');
      }

      // Include 'Edit in JS Bin' button
      if (options.edit) {
        var data = {static: helpers.urlForStatic(''), root: helpers.url('/', true), csrf: options.csrf};
        insert.push('<script src="' + helpers.urlForStatic('js/render/edit.js?' + helpers.set('version')) + '"></script>');
        insert.push('<script>jsbinShowEdit(' +  JSON.stringify(data) + ');</script>');
      }

      // Trigger an event to allow listeners to apply scripts to the page.
      // Scripts will be passed to helpers.urlForStatic() if no protocol is present.
      if (!options.silent && _this.models.bin.isStreaming(bin)) { // jshint ignore:line
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
        var css = '\n<style id="jsbin-css">\n' + (bin.css || '') + '\n</style>';
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

    if (formatted) {
      if (options.analytics !== false) {
        helpers.analytics(true, onAnalyticsComplete);
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
      if (bin.active === 'n' || bin.archive === -1) {
        return;
      }

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
        var a = new Date(a.last_updated).getTime(),
            b = new Date(b.last_updated).getTime();
        return a == b ? 0 : a < b ? -1 : 1;
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
          summary: bin.summary || utils.titleForBin(bin),
          archive: bin.archive,
          url: helpers.urlForBin(bin),
          edit_url: helpers.editUrlForBin(bin) + '?' + query,
          last_updated: bin.last_updated.toISOString(),
          pretty_last_updated: utils.since(bin.last_updated),
          is_first: !map[bin.url].length
        });
      });

      fn(null, data);
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
        static: _this.helpers.urlForStatic()
      });

    });
  },
  delete: function (req, res, next) {
    // first check they own the bin
    var user = undefsafe(req, 'session.user.name');
    var owner = undefsafe(req, 'bin.metadata.name');
    var streamingKey = undefsafe(req, 'bin.streaming_key');

    // if the user doesn't own this bin...and
    if (user !== owner) {
      // the checksum doesn't match the key in the database
      if (req.body.checksum !== streamingKey) {
        // then it's not theirs to delete
        return res.send(403, {error: 'Not authorised.'});
      }
    }

    // using -1 as the marker on the archive field to say "this is deleted"
    // since we don't have an active field on the owners table.
    // broader issue explained here: https://github.com/jsbin/jsbin/issues/1056
    this.models.bin.updateOwnersData(req.bin, {archive: -1, url: 'deleted/'+ req.bin.url}, function () {});

    this.models.bin.updateBinData(req.bin, {active: 'n', url: 'deleted/'+ req.bin.url}, function (error) {
      if (error) {
        console.error(error);
        return res.send(400, {error: 'The bin could not be deleted.', detail: error });
      }

      metrics.increment('bin.deleted');

      res.send(200, true);
    });
  },
  archiveBin: function (archive, req, res, next) {
    if (!req.session.user) {
      return res.send(403, {error: 'Not authorised.'});
    }
    var bin = {
      url: req.param('bin'),
      revision: req.param('rev'),
      name: req.session.user.name,
      archive: archive
    };

    this.models.bin.archive(bin, function (err) {
      if (err) {
        return res.send(err);
      }
      metrics.increment('bin.archived');
      res.send(200, bin);
    });
  }
});
