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
    RSVP       = require('rsvp'),
    Promise    = RSVP.Promise,
    config     = require('../config'),
    welcomePanel = require('../welcome-panel'),
    binToFile  = require('bin-to-file'),
    Observable = utils.Observable,
    flash      = require('../fat-flash');

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
    if ((req.subdomain && custom[req.subdomain]) || custom.default) {
      return this.getCustom(req, res, next);
    }
    this.renderFiles(req, res, next);
  },
  getFromPost: function (req, res, next) {
    var processorTypes = 'jade markdown less stylus sass scss coffeescript processing traceur typescript jsx babel'.split(' '),
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
          data[aliases[panel]] = (data[panel] || '').trim();
          panel = aliases[panel];
        }

        // if we're dealing with a processor in the posted data, then add it to
        // settings and move it to the correct panel name (ie. coffeescript => js)
        if (processorTypes.indexOf(panel) !== -1) {
          // mark this as a processor
          processorSettings[processors.lookup[panel]] = panel;

          // then change the panel name to match the actual panel, and let the
          // processor kick in during render
          data[processors.lookup[panel]] = (data[panel] || '').trim();
          delete data[panel];
          panel = processors.lookup[panel];
        }
        data[panel] = decodeURIComponent(data[panel]);
      }
    });

    if (Object.keys(processorSettings).length) {
      data.settings.processors = processorSettings;
    }

    data.post = true;
    var id = flash.set(data);
    req.flash('postedBin', id);

    this.render(req, res, data);
  },
  getCustom: function (req, res, next) {
    var config = custom[req.subdomain] || custom.default,
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

      req.bin = defaults;
      next();
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
  apiGetBin: function (req, res, next) {
    this.applyProcessors(req.bin).then(function (bin) {
      res.json(this.apiPrepareBin(bin));
    }, function () {
      res.json(null);
    });
  },
  live: function (req, res, next) {
    req.live = true;
    next();
  },
  embed: function (req, res, next) {
    req.embed = true;
    next();
  },
  testPreviewAllowed: function (req, res, next) {
    /**
     * if the bin does not have a user who create it
     * and it was made 2 hours ago
     * then redirect to the /edit url
     */
    var user = undefsafe(req, 'bin.metadata.name');
    if (config.security.allowAnonymousPreview !== true && user === 'anonymous' || !user) {
      var created = req.bin.created;

      // this is hard coded for production jsbin.com - it means that all bins
      // created before we released this change won't be affected by the limit
      if (config.url.host === 'jsbin.com') {
        if (req.bin.id < 10786492) {
          return next();
        }
      }

      // test the time created, and if it's older than 90 minutes, then redirect
      // to the edit view. Details as to why on our blog
      if ((Date.now() - created.getTime()) / 1000 / 60 > 90) {
        var msg = 'This bin was created anonymously and its free preview time has expired (<a target="_blank" href="http://jsbin.com/blog/security-limited-output#limitedfulloutputforanonymousbins">learn why</a>).';

        if (!req.session.user) {
          msg += ' — <a href="/register">Get a free unrestricted account</a>';
        } else {
          msg += ' — <a class="clone" href="/clone">Clone it to enable the full preview</a>';
        }


        res.flash(req.flash.NOTIFICATION, msg);
        return res.redirect(this.helpers.urlForBin(req.bin) + '/edit');
      }
    }
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
          } else if (req.subdomain.toLowerCase() !== (undefsafe(bin, 'metadata.name') || '').toLowerCase()) {
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
        this.formatPreview(req, req.bin, options, function (err, formatted) {
          if (err) {
            // don't hide inside a promise
            // return next(err);
            throw err;
          }

          if (req.bin.settings) {
            // check to see if there's a custom status code
            if (req.bin.settings.statusCode) {
              res.statusCode = parseInt(req.bin.settings.statusCode);
            }

            if (req.bin.settings.headers && req.bin.settings.headers.constructor === Object) {
              try {
                res.set(req.bin.settings.headers);
              } catch (e) {
                res.set('x-failed-headers', e.message);
              }
            }

            return res.send(formatted);
          }

          if (req.ajax && req.params.format !== 'html') {
            res.json(this.apiPrepareBin(req.bin));
          } else if (formatted) {
            res.send(formatted);
          } else {
            res.contentType('js');
            res.send(req.bin.javascript);
          }
        }.bind(this));
      }.bind(this)).catch(function (error) {
        if (error instanceof Error) {
          next(error);
        } else {
          res.redirect(this.helpers.url(req.url, true));
        }
      }.bind(this));
    }.bind(this));
  },
  // TODO decide whether this is used anymore
  getBinSource: function (req, res) {
    var copy = _.extend({}, req.bin);
    copy.sourceOnly = req.sourceOnly;
    this.protectVisibility(req.session.user, copy, function(err, bin){
      res.contentType('text/plain');
      var file = binToFile(bin, { proto: req.secure ? 'https' : 'http' });
      res.send(file);
    }.bind(this));
  },
  getBinSourceFile: function (req, res) {
    this.protectVisibility(req.session.user, req.bin, function(err, bin){
      var format = req.params.format,
          settings = bin.settings || {},
          reverseProcessorLookup = {},
          contentType = processors.mime[format] || processors.mime._default;

      // this doesn't do anything except tell you, the reader, what's going on.
      req.bin = bin;

      if (format === 'js') {
        format = 'javascript';
        contentType = 'application/javascript';
      }

      if (format === 'json') {
        format = 'javascript';
        contentType = 'application/json';
      }

      if (format === 'md') {
        format = 'markdown';
      }

      if (format === 'coffee') {
        format = 'coffeescript';
      }

      if (format === 'ls') {
        format = 'livescript';
      }

      if (format === 'svg') {
        contentType = 'image/svg+xml';
        req.bin.svg = req.bin.html;
        res.set('X-Frame-Options', 'SAMEORIGIN');
      }

      if (format === 'es6') {
        format = 'babel';
      }

      var _this = this;

      new Promise(function (resolve, reject) {
        if (!settings.processors) {
          return resolve(bin);
        }

        if (settings.processors) {
          // first shuffle the bin around so they can request .less and get the
          // .css panel...yeah, funky { html: 'markdown' }
          Object.keys(settings.processors).forEach(function (key) {
            if (settings.processors.hasOwnProperty(key)) {
              reverseProcessorLookup[settings.processors[key]] = key;
            }
          });

          // if we want the raw preprocessed content, just map
          if (reverseProcessorLookup[format]) {
            bin[format] = bin[reverseProcessorLookup[format]];
            resolve(bin);
          } else if (settings.processors[format]) {
            // else we need to convert and process the source
            if (processors.support(settings.processors[format])) {
              // keep only the single processor we need
              var singleProcessor = {};
              singleProcessor[format] = settings.processors[format];
              bin.settings.processors = singleProcessor;

              _this.applyProcessors(bin).then(function (results) {
                bin = results[0];

                // Processor object
                if (typeof bin[format] === 'object') {
                  if (bin[format].result !== null) {
                    bin[format] = bin[format].result;
                  } else if (bin[format].errors !== null) {
                    // TODO do we show the errors in the source code?
                    bin[format] = bin[format].errors;
                  }
                }

                // bin[format] = bin[settings.processors[format]];
                // this delete ensures it doesn't happen again (in case we're
                // looking at .html)
                delete bin.settings.processors[format];
                resolve(bin);
              }, function (error) {
                reject(error);
              });
            } else {
              reject('Unsupported extension: ' + settings.processors[format]);
            }
          } else { // usually for .html
            resolve(bin);
          }
        }
      }).then(function () {
        if (format !== 'html' || contentType !== 'text/html') {
          if (settings.statusCode) {
            res.statusCode = settings.statusCode;
          }

          res.contentType(contentType);

          if (settings.headers) {
            res.set(settings.headers);
          }

          res.send(req.bin[format]);
        } else {
          _this.getBinPreview(req, res);
        }
      }).catch(function (error) {
        res.send(500);
      });
    }.bind(this));
  },
  getUserBins: function (req, res, next) {
    var _this = this;

    var username = req.params.user || undefsafe(req, 'session.user.name');

    if (!username) {
      return next(404);
    }

    var callback = this.renderHistory.bind(this);
    var dbMethod = 'getBins';

    var acceptsJSON = (req.header('Accept', '') || req.header('content-type') || '').indexOf('application/json') > -1;

    // only support details for ajax requests
    if (req.query.detailed && acceptsJSON || req.isApi) {
      callback = this.renderDetailedHistory.bind(this)
      dbMethod = 'getUserListing';
    };

    // TODO: convert to promise
    this.models.user.load(username, function (error, user) {
      if (error || !user) {
        return next(404);
      }

      this.models.user[dbMethod](req.params.user || req.session.user.name, function (err, bins) {
        if (err) {
          return next(404);
        }

        callback(req, res, next, bins);
      }.bind(this));
    }.bind(this), true);
    // ^^^^ indicates we want to only check by username (and don't bother email check)
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
    var bin = utils.extract(req.body, 'html', 'css', 'javascript', 'settings');
    var params = _.clone(bin);
    var _this  = this;

    params.metadata = {
      user: req.session.user,
    };

    this.validateBin(params, function (err) {
      if (err) {
        return next(err);
      }

      bin.length = utils.binUrlLength(req);

      metrics.increment('bin.create');

      _this.models.bin.create(bin, function (err, result) {
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
  apiTrackBin: function (req, res, next) {
    this.models.user.saveBookmark(req.session.user, req.bin, req.apiKey, function (error) {
      next(error);
    });
  },
  createRevision: function (req, res, next) {
    var panel  = req.param('panel'),
        params = {},
        handler  = this,
        models = this.models,
        binSettings = {};

    try {
      binSettings = JSON.parse(req.param('settings'));
    } catch (e) {}

    binSettings = JSON.stringify(deepExtend(req.bin.settings, binSettings));

    // create a new revision
    if (req.param('method') === 'save') {
      params = utils.extract(req.body, 'html', 'css', 'javascript');
      params.url = req.bin.url;
      params.revision = parseInt(req.params.rev, 10) || 1; //req.bin.revision;
      // catch for when this is a claimed bin, with no metadata as it does not
      // exist in the owners table yet.
      // we would put this in the :bin param but the claimBin uses :url to get
      // around the error that would be thrown.
      params.visibility = req.bin.metadata ? req.bin.metadata.visibility : 'public';
      params.settings = binSettings;

      // this is the bin that will be *created*
      var bin = _.extend({}, req.bin || {}, params);
      params.summary = utils.titleForBin(bin);

      // create fake metadata to allow user prefs to be read
      params.metadata = {
        user: req.session.user,
      };

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
          } else if (result.isowner || req.bin.streaming_key === req.body.checksum) {
            metrics.increment('bin.create-revision');
            method = 'createRevision';
            params.revision = req.bin.revision + 1; // bump the revision from the *latest*

            if (result.isowner) {
              // remove the streaming_key from this one
              handler.models.bin.updateBinData(req.bin, { streaming_key: '' }, function (error) { // jshint ignore:line
                if (error) {
                  console.error('models.bin.updateBinData:streaming_key', error);
                }
              });
            }
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
              handler.emit('new-revision', bin, newBin);
            });

            handler.completeCreateBin(result, req, res, next);
          });
        });
      });
    } else if (req.param('method') === 'update') { // update current revision
      params[panel] = req.param('content');
      params.streamingKey = req.param('checksum');
      params.revision = req.param('revision');
      params.url = req.param('code');
      params.settings = binSettings;
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

            var dropbox_token = undefsafe(req, 'session.user.dropbox_token');
            if (features('dropbox', req) && !!dropbox_token) {
              handler.applyProcessors(bin).then(function (result) {
                models.bin.saveToDropbox(result[0], dropbox_token);
              }).catch(function (error) {
                console.error(error);
              });
            }
          }

          handler.emit('updated', req.bin, {
            panelId: panel,
            content: params[panel],
            processed: req.body.processed,
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
  completeCreateBin: function (bin, req, res, next) {
    var self  = this;

    if (!bin.summary) {
      bin.summary = utils.titleForBin(bin);
    }

    function render() {
      if (req.isApi) {
        req.bin = bin;
        return next();
      } else {
        self.emit('created', bin);
        self.renderCreated(req, res, bin);
      }
    }

    // If we have a logged in user then assign the bin to them.
    if (req.session.user && req.session.user.name) {
      self.models.user.setBinOwner(req.session.user.name, bin, function (err) {
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
    this.protectVisibility(req.session.user, req.bin, function(err, bin) {
      var filename = ['jsbin', bin.url, bin.revision, 'html'].join('.');

      var data = {
        domain: this.helpers.set('url host'),
        permalink: this.helpers.editUrlForBin(bin, true),
        user: undefsafe(bin, 'metadata.name') || false,
        year: (new Date()).getYear() + 1900
      };

      // get the meta tag with license
      this.helpers.render('comment', data, function (err, meta) {
        bin.meta = meta;

        var file = binToFile(bin, { proto: req.secure ? 'https' : 'http' });

        metrics.increment('bin.download');

        res.header('Content-Disposition', 'attachment; filename=' + filename);
        res.send(file);
      });
    }.bind(this));
  },
  notFound: function (req, res, next) {
    var self = this;
    var errorMessage;

    if (req.isApi || req.ajax) {
      res.status(404);
      errorMessage = 'Could not find bin with ID "' + req.param('bin') + '"';

      if (req.param('rev')) {
        errorMessage += ' and revision ' + req.param('rev');
      }

      res.json({ error: errorMessage });

    } else {
      this.loadFiles(this.defaultFiles(), function (err, results) {
        if (err) {
          return next(err);
        }

        results.url = req.param('bin');

        // Need to get the most recent revision from the database.
        var bin = {};
        // so go ahead and completely reset the bin to a not found state
        bin.metadata = {};
        bin.html = results[0];
        bin.css = results[1];
        bin.javascript = results[2];

        if (req.url.indexOf('edit') > -1) {
          self.render(req, res, results);
        } else {
          var options = {edit: true, silent: true, csrf: req.session._csrf};
          self.formatPreview(req, results, options, function (err, formatted) {
            if (err) {
              return next(err);
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
    }
  },
  loadBin: function (req, res, next) {
    var self = this;
    var rev    = parseInt(req.params.rev, 10) || 'latest',
        username = undefsafe(req, 'session.user.name'),
        query  = {id: req.params.bin, revision: rev, username: username },
        helpers = this.helpers,
        models = this.models;

    function complete(err, result) {
      if (err && err !== 401) {
        return next(err);
      }

      // if no result, and no error and doesn't end with save, then bail
      if (!result && !err && !/\/save$/.test(req.url)) {
        metrics.increment('bin.404');
        return next(new errors.BinNotFound('Could not find bin: ' + req.params.bin));
      }

      if (!result && err === 401) {
        metrics.increment('bin.404');
        return next(new errors.BinNotFound('Could not find bin: ' + req.params.bin));
      } else {
        if (!result) {
          req.bin = {url: req.params.bin, revision: 0, streaming_key: req.body.checksum };
          return self.createRevision(req, res, next);
        }
        var flag = undefsafe(result, 'metadata.flagged');
        if (flag) {
          var ip = (req.headers['x-real-ip'] || req.ip);
          if (username === result.metadata.name && ip !== flag) {
            // log ip
            models.user.updateOwnershipData(username, {
              flagged: ip
            }, function () {});
            // continue to next()
          } else if (username !== result.metadata.name && ip !== flag) {
            metrics.increment('bin.404-banned-user');
            return next(new errors.BinNotFound('Could not find bin: ' + req.params.bin));
          }
        }

        req.bin = result;
        // manually add the full url to the bin to allow templates access
        req.bin.permalink = helpers.urlForBin(req.bin, true);

        next();
      }
    }

    // TODO: Re-factor this logic.
    if (rev === 'latest' || req.path.indexOf('save') !== -1) {
      models.bin.latest(req, query, complete);
    } else {
      models.bin.load(req, query, complete);
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

    if (!blacklist.validate(bin) && !undefsafe(bin, 'metadata.verified')) {
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
  sendStart: function (req, res) {
    this.protectVisibility(req.session.user, req.bin, function (err, bin) {
      var template = this.templateFromBin(bin),
          customConfig = custom[req.subdomain] || custom.default,
          helpers = this.helpers,
          version = helpers.set('version'),
          created = req.flash('checksum') || {},
          sslForAll = features('sslForAll', req),
          ssl = req.secure,
          root = helpers.url('', true, ssl),
          _this = this,
          user = req.session.user || {},
          production = (req.cookies && req.cookies.debug) ? false : helpers.production,
          jsbin;

      template.html = template.html.replace(/%ua%/g, req.headers['user-agent']);

      // Insert the subdomain if the request has one. Ideally this should be
      // done by the helper.url() function but it's not currently aware of the
      // request object.
      if (req.subdomain && customConfig) {
        root = root.replace('://', '://' + req.subdomain + '.');
      }

      var statik = helpers.urlForStatic(undefined, ssl);
      var http = req.secure ? 'https' : 'http';

      // used to customise the style, panels, etc.
      var settings = !bin.url ? customConfig && customConfig.settings : {};

      if (req.embed) {
        if (features('customEmbed', { session: { user: bin.metadata }})) {
          var embed = bin.metadata.embed;
          try {
            embed = JSON.parse(bin.metadata.embed);
          } catch (e) {}
          if (embed && embed.override) {
            settings.editor = embed.editor;
            settings.font = embed.font;
            delete settings.editor.css;
          }
        }
      }

      var processors = undefsafe(bin, 'settings.processors');

      if (!processors) {
        if (customConfig && customConfig.processors) {
          processors = customConfig.processors;
        } else {
          processors = {};
        }
      }

      jsbin = this.jsbin(bin.url ? bin : {}, {
        token: req.session._csrf,
        metadata: bin.metadata,
        name: undefsafe(customConfig, 'name') || 'JS Bin',
        settings: settings,
        processors: processors,
        // If we've pulled a just created bin out of the flash messages object
        // then we check to see if the previously created bin is the one we're
        // about to load. If so we add the checksum to the page which allows
        // the spike logic to work in IE8.
        checksum: created.url === bin.url && created.revision === bin.revision && created.checksum
      });

      // only expose the parts of the user we want
      var userfields = 'avatar name bincount created pro settings';
      jsbin.user = _.pick.apply(_, [user].concat(userfields.split(' ')));

      if (!jsbin.user.avatar && req.session.user) {
        req.session.user.avatar = jsbin.user.avatar = req.app.locals.gravatar(req.session.user);
      }

      if (jsbin.user.avatar) {
        jsbin.user.large_avatar = req.app.locals.gravatar(req.session.user, 120); // jshint ignore:line
      }

      // if you don't have the checksum AND the bin is currently writable (i.e.
      // streaming) AND you're not the owner - then make it readonly
      if ((!jsbin.state.checksum && jsbin.state.streaming === true) &&
        (bin.metadata.name !== user.name)
        // but disabled for anonymous owners
        // && bin.metadata.name !== 'anonymous'
      ) {
        req.live = true;
      }

      if (req.live || req.embed || req.sandbox) {
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

      // as backup - i.e. the user has not refreshed their session and
      // req.session.user.settings === null - which we don't want.
      if (!undefsafe(jsbin, 'user.settings')) {
        jsbin.user.settings = {};
      }

      var url = helpers.urlForBin(bin);

      if (req.embed) {
        // prevent it showing up in embedded views (in case someone nabs it)
        delete jsbin.user;
      }

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

        var embedURL = null;
        if (req.bin) {
          embedURL = helpers.editUrlForBin(req.bin, true).replace(/\/edit/, '/embed');
          if (req.secure) {
            embedURL = embedURL.replace(/http:/, 'https:');
          }
        }

        if (info) {tipType = 'info';}
        if (notification) {tipType = 'notification';}
        if (error) {tipType = 'error';}

        metrics.increment('bin.viewed');

        var topPanel = undefsafe(jsbin, 'user.settings.gui.toppanel');

        res.header('Cache-Control', 'no-cache, no-store, must-revalidate'); // http 1.1
        res.header('Pragma', 'no-cache'); // http 1.0
        res.header('Expires', 0); // proxies.
        res.header('content-type', 'application/javascript');
        res.render('start', {
          production: req.app.get('is_production'),
          jsbin: JSON
            .stringify(jsbin)
            .replace(/<\/script/gi, '<\\/script')
            .replace(/<!--/g, '<\\!--'),
          template: JSON
            .stringify(template)
            .replace(/<\/script/gi, '<\\/script')
            .replace(/<!--/g, '<\\!--'),
        });
      };

      if (jsbin.user) { // i.e. logged in and not embed views
        _this.models.user.getBinCount(user.name, function (err, result) {
          if (err || !result) {
            return done(err);
          }
          user.bincount = result.total;
          done();
        });
      } else {
        done();
      }

    }.bind(this));
  },
  render: function renderEdit(req, res, bin) {
    if (!bin) bin = req.bin;
    var customConfig = custom[req.subdomain] || custom.default;
    var helpers = this.helpers;
    var version = helpers.set('version');
    var created = req.flash('checksum') || {};
    var ssl = req.secure;
    var root = helpers.url('', true, req.secure);
    var _this = this;
    var user = req.session.user || {};
    var production = (req.cookies && req.cookies.debug) ? false : helpers.production;

    if (req.subdomain && customConfig) {
      root = root.replace('://', '://' + req.subdomain + '.');
    }

    var statik = helpers.urlForStatic(undefined, req.secure);

    // mock up a fake bin object based on the url
    if (!bin) bin = {
      url: req.params.binname,
      revision: req.params.revision,
    };

    var url = helpers.urlForBin(bin);
    var user = req.session.user || {};


    // Sort out the tip
    var info = req.flash(req.flash.INFO);
    var error = req.flash(req.flash.ERROR);
    var notification = req.flash(req.flash.NOTIFICATION);

    var tip = error || notification || info;
    var tipType = '';

    var addons = [];
    if (!production) {
      for (var prop in scripts.addons) {
        if (scripts.addons.hasOwnProperty(prop)) {
          addons = addons.concat(scripts.addons[prop]);
        }
      }
    }

    var embedURL = null;
    if (req.bin) {
      embedURL = helpers.editUrlForBin(req.bin, true).replace(/\/edit/, '/embed');
      if (req.secure) {
        embedURL = embedURL.replace(/http:/, 'https:');
      }
    }

    if (info) {tipType = 'info';}
    if (notification) {tipType = 'notification';}
    if (error) {tipType = 'error';}

    metrics.increment('bin.viewed');

    var topPanel = undefsafe(req, 'user.settings.gui.toppanel');

    var userCSS = '';
    if (req.embed) {
      if (features('customEmbed', { session: { user: bin.metadata }})) {
        var embed = bin.metadata.embed;
        try {
          embed = JSON.parse(bin.metadata.embed);
        } catch (e) {}

        if (embed) {
          userCSS = embed.css || '';
        }
      }
    }

    var bodyClass = '';

    if (req.query.min) {
      bodyClass = 'min';
    }

    res.render('index', {
      bodyClass: bodyClass,
      userCSS: userCSS,
      topPanel: topPanel === undefined ? null : topPanel,
      addons: production ? false : addons,
      analyticsAltId: req.embed && undefsafe(config, 'analytics.render-id') ? undefsafe(config, 'analytics.render-id') : null,
      bin: req.bin || null,
      bincount: user.bincount,
      code_id: bin.url,
      code_id_domain: helpers.urlForBin(bin, true).replace(/^https?:\/\//, ''),
      code_id_path: url,
      concat: req.cookies && req.cookies.debug ? req.cookies.debug === 'concat' : false,
      custom_css: customConfig && customConfig.css,
      custom_js: customConfig && customConfig.js,
      editorLayout: undefsafe(user, 'settings.layout') || '0', // "0" means don't use it
      email: user.email || null,
      embed: req.embed,
      embedURL: embedURL,
      flash_tip: tip,
      flash_tip_type: tipType,
      gravatar: user.avatar,
      home:  user.name || null,
      isProduction: production,
      large_gravatar: req.app.locals.gravatar(user, 120),
      live: req.live,
      private: bin.metadata ? bin.metadata.visibility === 'private' : false,
      pro: user.pro,
      request: req,
      revision: bin.revision || 1,
      root: root,
      scripts: production ? false : scripts.app,
      static: statik,
      tips: '{}',
      token: req.session._csrf,
      url: url,
      user: user || null,
      vanity: features('vanity', req) ? 'http://' + req.session.user.name + '.' + req.app.get('url host') : root,
      welcomePanel: welcomePanel.getData(),
    });
  },
  renderFiles: function (req, res, next) {
    var _this = this;
    this.loadFiles(this.defaultFiles(), function (err, results) {
      if (!err) {
        if (next) {
          req.bin = results;
          return next();
        } else {
          // depreciated
          _this.render(req, res, results);
        }
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
        latest: bin.latest,
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
  renderDetailedHistory: function (req, res, next, bins) {
    var helpers = this.helpers;
    this.formatHistory(bins, function (bin, map) {
      var settings = bin.settings ? JSON.parse(bin.settings) : {};

      var result = {
        code: bin.url,
        revision: bin.revision,
        title: settings.title,
        description: settings.description,
        url: helpers.urlForBin(bin),
        last_updated: bin.created.toISOString(),
        pretty_last_updated: utils.since(bin.created)
      };

      // this needs to get tidy, but we use 'snapshot' when public facing
      if (req.isApi) {
        result.snapshot = result.revision;
        result.url = result.code;
        delete result.revision;
        delete result.code;
      }
      return result;
    }, function (error, bins) {
      if (error) {
        return res.send(error);
      }
      res.send(bins);
    });
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


    this.formatHistory(bins, function (err, history) {
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
    var html = bin.html || '';
    var re = {
      head: /<head(.*)\n/i,
      meta: /(<meta name="description" content=")([^"]*)/im,
      title: /<title>(.*)<\/title>/im
    };

    function getTagContent(tag) {
      var result = '';

      // if we don't have the tag, bail with an empty string
      if (html.indexOf('<' + tag) === -1) {
        return result;
      }

      if (tag !== 'title' && tag !== 'meta') {
        console.error('getTagContent for ' + tag + ' is not supported');
        return result;
      }

      // grab the content based on the earlier defined regexp
      html.replace(re[tag], function (all, capture1, capture2) {
        result = tag === 'title' ? capture1 : capture2;
      });

      return result;
    }

    var binSettings = bin.settings || {};
    var panels = binSettings.panels || Object.keys(_.pick(bin, 'html', 'javascript', 'css')).filter(function (panel) {
      return !!bin[panel].trim();
    });

    if (panels.length) {
      panels.push('live');
    }

    if (!options.metadata) {
      options.metadata = {};
    }

    if (options.metadata.email) {
      options.metadata.avatar = this.helpers.gravatar(options.metadata);
    }

    options.metadata = _.pick.apply(_, [options.metadata].concat('archive avatar created last_login name pro summary updated visibility'.split(' ')));

    // this value isn't always present in anonymous metadata
    options.metadata.last_updated = bin.created;

    var statik = options.static || options.root || undefined;
    var runner = this.helpers.runner;
    if (statik && statik.indexOf('https') === 0) {
      // then ensure the runner is also https
      if (runner.indexOf('https') === -1) {
        runner = runner.replace(/http/, 'https');
      }
    }

    var result = {
      root: options.root,
      shareRoot: options.shareRoot,
      // runner: runner,
      static: statik,
      version: options.version,
      state: {
        title: getTagContent('title'),
        description: getTagContent('meta'),
        token: options.token,
        stream: false,
        streaming: this.models.bin.isStreaming(bin),
        code: bin.url || null,
        revision: bin.url ? (bin.revision || 1) : null,
        processors: options.processors || {},
        checksum: options.checksum || null,
        metadata: options.metadata,
        latest: bin.latest || false
      },
      name: options.name,
      settings: options.settings ? _.extend({}, { panels: panels }, options.settings) : { panels: panels }
    };

    return result;
  },
  templateFromBin: function (bin) {
    var template = utils.extract(bin, 'html', 'css', 'javascript');

    'html css javascript'.split(' ').forEach(function (panel) {
      template[panel] = utils.cleanForRender(template[panel] || '');
    });

    if (bin && bin.post) {
      template.post = bin.post;
    }

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
    var cache = this.loadFiles.cache || {};

    if (!this.loadFiles.cache) {
      this.loadFiles.cache = cache;
    } else {
      return fn(cache.error, _.clone(cache.result));
    }

    async.files(files, this.helpers.set('views')).readFile('utf8').toArray(function (err, results) {
      cache.error = err;
      if (!err) {
        cache.result = {
          html: results[0].data,
          css: results[1].data,
          javascript: results[2].data,
          settings: {}
        };
        fn(null, _.clone(cache.result));
      } else {
        fn(err);
      }
    });
  },
  // applies the processors to the bin and generates the html, js, etc
  // based on the appropriate processor. Used in the previews and the API
  // requests.
  applyProcessors: function (bin) {
    var binSettings = {};

    // self defence against muppertary
    if (typeof bin.settings === 'string') {
      try {
        binSettings = JSON.parse(bin.settings);
      } catch (e) {}
    } else {
      binSettings = bin.settings;
    }

    if (binSettings && binSettings.processors && Object.keys(binSettings.processors).length) {
      return new RSVP.all(Object.keys(binSettings.processors).map(function (panel) {
        var processorName = binSettings.processors[panel],
            code = bin[panel];
        if (processors.support(processorName)) {
          bin['original_' + panel] = code;
          return processors.run(processorName, {
            source: code,
            url: bin.url,
            revision: bin.revision
          }).then(function (output) {
            var result = '';
            if (output.result) {
              result = output.result;
            } else {
              result = output.errors.map(function (error) {
                return 'Line: ' + error.line + '\nCharacter: ' + error.ch + '\nMessage: ' + error.msg;
              }).join('\n\n');
            }
            bin[panel] = result;
            return bin;
          }).catch(function () {
            return bin;
          });
        } else {
          return new RSVP.resolve(bin);
        }
      }));
    }

    // otherwise default to being resolved
    return RSVP.resolve([bin]);
  },
  formatPreview: function (req, bin, options, fn) {
    var _this = this;
    var helpers = this.helpers;

    this.applyProcessors(bin).then(function (bin) {
      var formatted = bin[0].html || '';

      metrics.increment('bin.rendered');

      options = options || {};

      if (formatted) {
        if (config.analytics && config.analytics['render-id']) {
          helpers.renderAnalytics(true, function (err, analytics) {
            onAnalyticsComplete(err, formatted, analytics);
          });
        } else {
          onAnalyticsComplete(null, formatted);
        }
      } else {
        fn(null, formatted); // FIXME is this right?
      }
    }).catch(function (error) {
      console.error('formatPreview', error);
      fn(error || new Error('Could not render output'));
    });

    function onAnalyticsComplete(err, formatted, analytics) {
      var insert = [];
      var scripts = [];
      var parts;
      var last;
      var context;

      if (err) {
        return fn(err);
      }

      // Processor object
      ['html', 'css', 'javascript'].forEach(function (format) {
        if (typeof bin[format] === 'object' && bin[format] !== null) {
          if (bin[format].result !== null) {
            bin[format] = bin[format].result;
          } else if (bin[format].errors !== null) {
            // TODO do we show the errors in the source code?
            bin[format] = bin[format].errors;
          }
        }
        if (!bin[format]) {
          bin[format] = '';
        }
      });

      // Insert JS at %code% or as the first script
      if (formatted.indexOf('%code%') > -1) {
        var jsparts = formatted.split('%code%');
        formatted = jsparts.join(bin.javascript);
      } else if (bin.javascript.trim()) {
        insert.push('<script>', bin.javascript.trim(), '</script>');
      }

      // Include 'Edit in JS Bin' button
      if (options.edit && !req.ajax) {
        var data = {static: helpers.urlForStatic('', req.secure), root: helpers.url('/', true, req.secure) };
        insert.push('<script src="' + helpers.urlForStatic('js/render/edit.js?' + helpers.set('version'), req.secure) + '"></script>');
        insert.push('<script>jsbinShowEdit && jsbinShowEdit(' +  JSON.stringify(data) + ');</script>');
      }

      // Trigger an event to allow listeners to apply scripts to the page.
      // Scripts will be passed to helpers.urlForStatic() if no protocol is present.
      if (!options.silent && _this.models.bin.isStreaming(bin)) { // jshint ignore:line
        _this.emit('render-scripts', scripts);
        insert = insert.concat(scripts.map(function (script) {
          script = script.indexOf('http') === 0 ? script : helpers.urlForStatic(script, req.secure);
          return '<script src="' + script + '"></script>';
        }));
      }

      // Analytics
      if (options.silent !== true && helpers.production && analytics && !req.ajax) {
        insert.push(analytics);
      }

      // Add CSS at %css% or find a place for it
      if (formatted.indexOf('%css%') > -1) {
        formatted = formatted.replace(/%css%/g, bin.css || '');
      } else if (bin.css.trim()) {
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
        permalink: helpers.editUrlForBin(bin, true),
        user: undefsafe(bin, 'metadata.name') || false,
        year: (new Date()).getYear() + 1900
      };

      // Append attribution comment to header.
      helpers.render('comment', context, function (err, comment) {
        var done = false;
        formatted = formatted.replace(/<meta.*?charset.*?[^>]*>/, function ($0) {
          if ($0) {
            done = true;
          }
          return $0 + '\n' + (comment || '').trim();
        });

        if (!done) {
          formatted = formatted.replace(/<html[^>]*>/, function ($0) {
            return $0 + '\n' + (comment || '').trim();
          });
        }
        return fn(err || null, err ? undefined : formatted);
      });
    }
  },
  formatHistory: function (bins, format, fn) {
    // reorder the bins based latest edited, and group by bin.url
    var helpers = this.helpers,
        order = {},
        urls = {},
        orderedBins, loopOrder, i, length;

    if (fn === undefined) {
      fn = format;
      format = function (bin, map) {
        var settings = bin.settings || {};
        var desc = settings.desc || settings.title;

        return {
          code: bin.url,
          revision: bin.revision,
          summary: desc || bin.summary || utils.titleForBin(bin),
          archive: bin.archive,
          url: helpers.urlForBin(bin),
          edit_url: helpers.editUrlForBin(bin),
          last_updated: bin.last_updated.toISOString(),
          pretty_last_updated: utils.since(bin.last_updated),
          is_first: !map[bin.url].length
        }
      };
    }

    bins.forEach(function (bin) {
      if (bin.active === 'n' || bin.archive === -1) {
        return;
      }

      if (!bin.last_updated && bin.created) {
        bin.last_updated = bin.created;
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

    var map = {}, data = [], key;

    bins.forEach(function (bin) {
      var revisions = map[bin.url];

      if (!revisions) {
        revisions = map[bin.url] = [];
        data.push(revisions);
      }

      revisions.push(format(bin, map));
    });

    fn(null, data);
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
  deleteAll: function (req, res, next) {

  },
  delete: function (req, res, next) {
    // first check they own the bin
    var user = undefsafe(req, 'session.user.name');
    var owner = undefsafe(req, 'bin.metadata.name');
    var streamingKey = undefsafe(req, 'bin.streaming_key');

    // Only check if they're not admin
    if (features('admin', req) === false) {
      // if the user doesn't own this bin...and
      if (user !== owner) {
        // the checksum doesn't match the key in the database
        if (req.body.checksum !== streamingKey) {
          // then it's not theirs to delete
          return res.send(403, {error: 'Not authorised.'});
        }
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

      next();
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
  },
  transfer: function (req, res, next) {
    var self = this;
    self.models.user.load(req.body.to, function (error, user) {
      if (error) {
        return res.status(500).send(error);
      }

      if (!user) {
        return res.status(400).send(new Error('User not found'));
      }

      self.models.bin.updateOwnersData(req.bin, { name: req.body.to }, function (error, result) {
        if (error) {
          return res.status(500).send(error);
        }

        req.flash(req.flash.INFO, 'Successfully transfered to ' + user.name);
        res.send(200);
      });
    });
  },
  ensureOwnership: function (req, res, next) {
    // signed in owner
    if (undefsafe(req, 'bin.metadata.name') === undefsafe(req, 'session.user.name')) {
      return next();
    }

    // anonymous owner
    if (undefsafe(req, 'bin.streaming_key') === undefsafe(req, 'body.checksum')) {
      return next();
    }

    next(403);
  },
  updateSettings: function (req, res, next) {
    var body = req.body;
    var force = req.method === 'PUT' ? Object.keys(req.body) : [];
    ['processors', 'checksum'].forEach(function (key) {
      delete body[key];
    });
    var updatedSettings = JSON.stringify(deepExtend(req.bin.settings, body, force));
    this.models.bin.updateBinData(req.bin, {settings: updatedSettings}, function (err, result) {
      if (err) {
        return res.send(err);
      }
      res.send(200);
    });
  }
});

function deepExtend(base, obj, force) {
  force = force || [];
  base = _.extend({}, base);
  obj = _.extend({}, obj);
  for (var prop in base) {
    if (base.hasOwnProperty(prop)) {
      if (base[prop].constructor === Object && obj[prop]) {
        if (force.indexOf(prop) !== -1) {
          base[prop] = obj[prop];
        } else {
          obj[prop] = base[prop] = deepExtend(base[prop], obj[prop]);
        }
      }
    }
  }
  return _.extend(base, obj) || {};
}
