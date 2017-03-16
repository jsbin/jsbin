'use strict';
var express = require('express'),
    handlers = require('./handlers'),
    _ = require('underscore'),
    models = require('./models'),
    fs = require('fs'),
    parse = require('url').parse,
    helpers = require('./helpers'),
    custom = require('./custom'),
    utils = require('./utils'),
    spike = require('./spike'),
    features = require('./features'),
    processors = require('./processors'),
    middleware = require('./middleware'),
    metrics = require('./metrics'),
    flash = require('./fat-flash'),
    scripts = require('../scripts.json'),
    undefsafe = require('undefsafe'),
    config = require('./config'),
    reBin = null; // created when the module is imported
var request = require('request');


function tag(label) {
  'use strict';
  return function (req, res, next) {
    req[label] = true;
    next();
  };
}

function time(label) {
  return function (req, res, next) {
    res.on('header', function () {
      metrics.timing(label, Date.now() - req.start);
      metrics.timing('request', Date.now() - req.start);
    });
    next();
  };
}

function nextRoute(req, res, next) {
  next('route');
}

function ensureRevisionIsInt(req, res, next) {
  var revision = req.params.rev;
  // If no revision, or the revision is a number continue
  // "abc"|0 === 0
  // "123abc"|0 === 0
  // 123|0 === 123
  if (!revision || revision|0 || revision === 'latest') {
    return next();
  }
  next(404);
}

module.exports = function (app) {
  'use strict';
  // A sandbox object to contain some specific objects that are commonly used by
  // handlers. In future it would be ideal that each handler only receives the
  // objects that it requires.
  var sandbox = {
    store:   app.store,
    models:  models,
    mailer:  app.mailer,
    helpers: helpers.createHelpers(app)
  };

  // Create handlers for accepting incoming requests.
  var binHandler = new handlers.BinHandler(sandbox);
  var sessionHandler = new handlers.SessionHandler(sandbox);
  var errorHandler = new handlers.ErrorHandler(sandbox);
  var userHandler = new handlers.UserHandler(sandbox);
  var upgradeHandler = handlers.upgrade;
  var adminHandler = handlers.admin;
  var assetHandler = handlers.assets;
  var oembedHander = handlers.oembed;

  var root = app.get('url full');

  reBin = new RegExp(root.replace(/^http.?:\/\//, '') + '/(.*?)/(?:(\\d+)/)?');

  function binParamFromReferer(req, res, next) {
    reBin.lastIndex = 0; // reset position

    var r = root.replace(/^https?:\/\//, '');

    // only allow cloning via url if it came from jsbin
    if (req.headers.referer && req.headers.referer.indexOf(r) !== -1) {
      var match = req.headers.referer.match(reBin) || [];
      if (match.length) {
        req.params.bin = match[1];
        req.params.rev = match[2];

        return next();
      }
    }

    next('route');
  }

  function redirectToOutput(req, res, next) {
    var output = undefsafe(config, 'security.preview');
    // redirect to output url (to prevent cross origin attacks)
    if (output && req.headers.host.indexOf(config.url.host) === 0) {
      return res.redirect((req.secure ? 'https://' : 'http://') + output + req.url);
    }

    next();
  }

  function secureOutput(req, res, next) {
    // 1. check request is supposed to be on a vanity url
    // 2. if not, then check if the req.headers.host matches security.preview
    // 3. if not, redirect
    var metadata = undefsafe(req, 'bin.metadata');
    var settings = {};
    var ssl = false;
    var url;

    if (req.headers.accept && req.headers.accept.indexOf('text/event-stream') !== -1) {
      // ignore event-stream requests
      return next();
    }

    // skip check for vanity and non-forced SSL
    if (res.locals.vanity) {
      return next();
    }

    if (!req.secure && features('sslForAll', req)) {
      var url = sandbox.helpers.url(req.url, true, true);
      return res.redirect(url);
    }

    return next();
  }

  function nocache(req, res, next) {
    res.header('cache-control', 'no-cache');
    next();
  }

  function redirect(url) {
    return function (req, res) {
      res.redirect(303, url);
    };
  }

  function shouldNotBeSecure(req, res, next) {
    // otherwise redirect to the http version
    if (req.shouldNotBeSecure) {
      return res.redirect('http://' + req.headers.host.replace(/:.*/, '') + req.url);
    }

    // if the flag isn't present, then skip on
    next();
  }

  function featureByBinOwner(feature, handler) {
    return function (req, res, next) {
      if (features(feature, { session: { user: undefsafe(req, 'bin.metadata') } })) {
        return next();
      }
      return handler(req, res, next);
    };
  }

  function denyframes(req, res, next) {
    res.setHeader('X-Frame-Options', 'DENY');
    next();
  }

  function sameoriginframes(req, res, next) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  }

  function captureRefererForLogin(req, res, next) {
    if (!req.session.user) {
      req.session.referer = req.session.referer || req.url;
    } else {
      delete req.session.referer;
    }
    next();
  }

  function redirectOffPreview(req, res, next) {
    var output = undefsafe(config, 'security.preview');
    if (output && req.headers.host === output) {
      return res.redirect((req.secure ? 'https://' : 'http://') + config.url.host + req.url);
    }

    next();
  }

  // Redirects

  // /about doesn't get hit in production - it goes via nginx to our learn repo
  app.get('/about', redirect('http://jsbin.com/about'));
  app.get('/manifest.json', function (req, res) {
    var statik = sandbox.helpers.urlForStatic(undefined, true);
    res.set('content-type', 'text/javascript');
    res.render('manifest-json', {
      static: statik,
      layout: false,
    });
  });
  app.get(['/issues', '/bugs'], redirect('https://github.com/jsbin/jsbin/issues/'));
  app.get(['/video', '/videos', '/tutorials'], redirect('http://www.youtube.com/playlist?list=PLXmT1r4krsTooRDWOrIu23P3SEZ3luIUq'));


  // Handler Events

  binHandler.on('updated', spike.ping.bind(spike));
  binHandler.on('reload', spike.reload.bind(spike));
  binHandler.on('latest-for-user', spike.updateUserSpikes.bind(spike));
  binHandler.on('new-revision', spike.bumpRevision.bind(spike));

  binHandler.on('render-scripts', spike.appendScripts.bind(spike, app.settings.version));

  // Load the bin from the store when encountered in the url. Also handles the
  // "latest" url action.
  app.param('bin', function (req, res, next) {
    var binurl = req.params.bin.toLowerCase(),
        re = /[^\w\-]/;
    if (re.test(binurl)) {
      return next(404);
    }

    if (app.settings.reserved.indexOf(binurl) !== -1) {
      metrics.increment('bin.validate.reserved');
      return next(404);
    }

    res.on('header', function () {
      var now = Date.now();
      if (req.bin) {
        metrics.timing('request.bin.loaded', now - req.start);
      } else {
        metrics.timing('request.bin.404', now - req.start);
      }
      metrics.timing('request', now - req.start);
    });

    if (req.route.path.slice(-('/source').length) === '/source') {
      req.sourceOnly = true;
    }

    next();
  }, userHandler.updateLastSeen, binHandler.loadBin, function (req, res, next) {
    if (req.bin) {
      app.emit('bin:loaded', req);
    }
    next();
  });

  // track the logged in and logged out numbers
  app.get('*', function (req, res, next) {
    if (req.url !== '/runner') {
      if (req.session.user) {
        metrics.increment('user.logged-in');
      } else {
        metrics.increment('user.logged-out');
      }
    }
    next('route');
  });

  // Note: this goes *above* the SSL route jumping that follows.
  app.get('/', denyframes, time('request.root'), userHandler.loadVanityURL, binHandler.loadBin, secureOutput, binHandler.getBinPreview);

  // Set up the routes

  // removed when SSL became available to all
  // app.get(/(?:.*\/(edit|watch|download|source)|^\/$)$/, function (req, res, next) {
  //   var ssl = features('sslForAll', req);

  //   if ( (!req.secure && ssl) || // a) request *should* be secure
  //        (req.secure && !ssl) ) { // b) request is secure and *should not* be
  //     var url = sandbox.helpers.url(req.url, true, ssl);
  //     return res.redirect(url);
  //   }

  //   next('route');
  // });

  // secure the following paths from being iframed, note that it's also applied
  // to full bin output
  app.get('/auth/*', denyframes, nextRoute);
  app.get('/account/*', denyframes, nextRoute);
  app.get('/admin/*', denyframes, nextRoute);

  app.get('/', redirectOffPreview, secureOutput, binHandler.getDefault, binHandler.render);
  app.get('/gist/*', shouldNotBeSecure, binHandler.getDefault, binHandler.render);
  app.post('/', binHandler.getFromPost);

  // sandbox
  app.get(['/-', '/null'], features.route('sandbox'), tag('sandbox'), binHandler.getDefault, binHandler.render);

  // Runner - if in production, let nginx pick up the runner
  if (app.locals.is_production) {
    app.render('runner', {
      scripts: false,
      'static': sandbox.helpers.urlForStatic(undefined, true),
    }, function (error, html) {
      fs.writeFile(__dirname + '/../public/runner.html', html);
    });
  }

  app.get('/runner', function (req, res) {
    var statik = sandbox.helpers.urlForStatic(undefined, req.secure);
    res.render('runner', {
      scripts: app.get('is_production') ? false : scripts.runner,
      'static': statik
    });
  });


  app.post('/processor', features.route('processors'), function (req, res) {
    processors.run(req.body.language, req.body).then(function (data) {
      res.send(data);
    }).catch(function (error) {
      console.error(error);
      res.send(500, error.message);
    });
  });

  app.get('/api/', binHandler.getUserBins);

  app.get('/api/:bin/:rev?', binHandler.loadBin, function (req, res, next) {
    if (!req.bin.revision) {
      return res.status(404).send({});
    }
    res.send({
      javascript: req.bin.javascript,
      html: req.bin.html,
      css: req.bin.css,
      settings: req.bin.settings,
      last_updated: undefsafe(req, 'bin.metadata.last_updated') || new Date().toJSON(),
      url: req.bin.url,
      snapshot: req.bin.revision
    });
  });
  app.delete('/api/:bin/:rev?', binHandler.loadBin, binHandler.delete, function (req, res) {
    res.send({
      url: req.bin.url,
      snapshot: req.bin.revision,
      deleted: true,
    });
  });
  app.post('/api/save', binHandler.createBin, binHandler.apiTrackBin, function (req, res, next) {
    res.send({
      url: req.bin.url,
      snapshot: req.bin.revision,
      summary: req.bin.summary,
    });
  });
  app.post('/api/:bin/save', function (req, res, next) {
    req.params.method = 'save';
    next();
  }, binHandler.createRevision, binHandler.apiTrackBin, function (req, res, next) {
    res.send({
      url: req.bin.url,
      snapshot: req.bin.revision,
      summary: req.bin.summary,
    });
  });

  app.post('/account/new-api-key', function (req, res, next) {
    sandbox.models.user.generateAPIKey(req.session.user.name, function (error, key) {
      if (error) {
        return res.status(500).send({
          error: error.message
        });
      }

      req.session.user.api_key = key;

      res.send({
        api_key: key,
      });
    });
  });
  app.get('/account/assets/sign', features.route('assets'), assetHandler.sign);
  app.get('/account/assets/sign', features.route('!assets'), function (req, res, next) {
    res.statusCode = 403;
    // res.send('Asset uploading is coming soon, but isn\'t available publicly yet!');
    res.send('<a href="/upgrade"><span class="pro-required">PRO</span></a> <a href="/upgrade">Asset uploading is a pro feature &ndash; upgrade today!</a>')
  });

  app.get('/account/assets/size', sessionHandler.requiresLoggedIn, features.route('assets'), assetHandler.size);
  app.post('/account/assets/remove', sessionHandler.requiresLoggedIn, features.route('assets'), assetHandler.remove);

  // patch this route to get them back to upgrade
  app.get('/account/upgrade', function (req, res) {
    res.redirect('/upgrade');
  });

  app.get('/account/upgrade/pay', function (req, res, next) {
    if (!req.session.user) {
      req.flash(req.flash.REFERER, req.url);
      req.flash(req.flash.NOTIFICATION, 'Before upgrading to <strong>Pro</strong> you will need to create a free account or log in.');
      return res.redirect('/login');
    }

    next('route');
  });

  // require that all account requests ensure login
  app.get('/account/*', sessionHandler.requiresLoggedIn, nextRoute);
  app.post('/account/*', sessionHandler.requiresLoggedIn, nextRoute);

  function alreadyUpgraded(req, res, next) {
    if (features('pro', req)) {
      return res.redirect('/account/subscription');
    }

    next('route');
  }

  app.get(['/account/upgrade/*', '/account/upgrade'], alreadyUpgraded);
  app.get('/upgrade', features.route('upgradeWithFeatures'), alreadyUpgraded);

  app.get('/account/subscription', features.route('pro'), upgradeHandler.subscription);
  app.post('/account/subscription/cancel', features.route('pro'), upgradeHandler.cancel, redirect('/'));
  app.post('/account/subscription/update-card', features.route('pro'), upgradeHandler.updateCard);

  app.get('/upgrade', features.route('!upgradeWithFeatures'), upgradeHandler.features);
  app.get('/upgrade', features.route('upgradeWithFeatures'), captureRefererForLogin, upgradeHandler.payment);

  app.post('/upgrade', features.route('upgradeWithFeatures'), sessionHandler.requiresLoggedIn, upgradeHandler.processPayment);

  app.get('/account/upgrade/pay', features.route('!upgradeWithFeatures'), upgradeHandler.payment);
  app.get('/account/upgrade/pay', features.route('upgradeWithFeatures'), redirect('/upgrade'));
  app.post('/account/upgrade/pay', features.route('!upgradeWithFeatures'), upgradeHandler.processPayment);

  app.get('/account/invoices/:invoice', upgradeHandler.invoice);


  // Account settings
  var renderAccountSettings = (function(){
    var pages = ['editor', 'embed', 'profile', 'delete', 'preferences', 'assets'];
    var titles = {
      editor: 'Editor settings',
      profile: 'Profile',
      preferences: 'Preferences',
      embed: 'Embed Styles',
      'delete': 'Delete your account',
    };

    return function renderAccountSettings (req, res) {
      var root = sandbox.helpers.url('', true, req.secure);
      var statik = sandbox.helpers.urlForStatic('', req.secure);
      var referrer = req.get('referer');

      var page = pages.indexOf(req.param('page')) === -1 ? false : req.param('page');

      if (page === 'assets' && !features('assets', req)) {
        page = false;
      }

      // if (page === 'embed' && !features('customEmbed', req)) {
      //   page = false;
      // }

      var addons = [];
      if (!app.get('is_production')) {
        for (var prop in scripts.addons) {
          if (scripts.addons.hasOwnProperty(prop)) {
            addons = addons.concat(scripts.addons[prop]);
          }
        }
      }

      var info = req.flash(req.flash.INFO),
          error = req.flash(req.flash.ERROR),
          notification = req.flash(req.flash.NOTIFICATION);

      var flash = error || notification || info;
      var flashType = '';
      if (info) {flashType = 'info';}
      if (notification) {flashType = 'notification';}
      if (error) {flashType = 'error';}

      if (!page) {
        return res.redirect('back');
      }

      if (undefsafe(req.session.user, 'embed.css')) {
        req.session.user.embed.css = req.session.user.embed.css
          .replace(/<\/script/gi, '<\\/script')
          .replace(/<!--/g, '<\\!--');
      }

      res.render('account/' + page, {
        title: titles[page],
        flash_tip: flash, // jshint ignore:line
        flash_tip_type: flashType, // jshint ignore:line
        token: req.session._csrf,
        layout: 'sub/layout.html',
        referrer: referrer,
        httproot: root.replace('https', 'http'),
        root: root,
        'static': statik,
        user: req.session.user,
        request: req,
        addons: app.get('is_production') ? false : addons,
      });
    };
  }());

  app.get('/account/:page', shouldNotBeSecure, features.route('accountPages'), renderAccountSettings);
  app.get('/account', function(req, res) {
    res.redirect('/account/editor');
  });

  app.post('/account/embed', features.route('accountPages'), features.route('customEmbed'), function(req, res) {
    if (!req.session || !req.session.user) {
      return res.send(400, 'Please log in');
    }
    var settings = {};
    try {
      settings = JSON.parse(req.body.settings);
    } catch (e) {} // let's ignore for now

    for (var prop in settings) {
      if (settings[prop] === 'true' || settings[prop] === 'false') {
        settings[prop] = settings[prop] === 'true' ? true : false;
      }
    }

    sandbox.models.user.updateOwnershipData(req.session.user.name, {
      embed: JSON.stringify(settings),
    }, function (error) {
      if (error) {
        console.log(error.stack);
        res.send(400, error);
      }
      req.session.user.embed = settings;
      res.json(200, { all: 'ok'});
    });
  });

  app.post('/account/editor', features.route('accountPages'), function(req, res) {
    if (!req.session || !req.session.user) {
      return res.send(400, 'Please log in');
    }
    var settings = {};
    try {
      settings = JSON.parse(req.body.settings);
    } catch (e) {} // let's ignore for now

    for(var prop in settings) {
      if(settings[prop] === 'true' || settings[prop] === 'false') {
        settings[prop] = settings[prop] === 'true' ? true : false;
      }
    }
    sandbox.models.user.updateSettings(req.session.user.name, settings, function(err) {
      if (err) {
        console.log(err.stack);
        res.send(400, err);
      }
      req.session.user.settings = settings;
      res.json(200, { all: 'ok'});
    });
  });

  app.get('/account/bookmark/vanity', features.route('vanity'), binParamFromReferer, binHandler.loadBin, userHandler.saveVanityURL);
  app.post('/account/bookmark/vanity', features.route('vanity'), function (req, res, next) {
    reBin.lastIndex = 0; // reset position

    // only allow cloning via url if it came from jsbin
    var match = req.body.url.match(reBin) || [];
    if (match.length) {
      req.params.bin = match[1];
      req.params.rev = match[2];
      return next();
    }

    res.send(400, 'You need to be on a bin to publish it as the vanity home page');

  }, binHandler.loadBin, userHandler.saveVanityURL);

  app.get('/account/bookmark/vanity', features.route('vanity'), function (req, res) {
    res.send({});
  });

  // Login/Create account.
  function renderLoginRegister(req, res) {
    var root = sandbox.helpers.url('', true, req.secure);

    if (req.subdomain) {
      root = root.replace('://', '://' + req.subdomain + '.');
    }

    if (req.session.user) {
      return res.redirect(root);
    }

    if (req.query.firsttime) {
      res.flash(req.flash.NOTIFICATION, 'We\'ve <a target="_blank" href="/blog/ssl"><strong>upgraded our login process to use SSL</strong></a>, however, this does mean  you have been logged out today, so please could you log in again below.<br><br><a href="http://github.com/jsbin/jsbin/issues/new" target="_blank">Questions/problems?</a>');
    }

    // TODO: I wish this were simpler, and automatically gave us the next flash
    // message (and perhaps handled the whole thing for us...)
    var info = req.flash(req.flash.INFO),
        error = req.flash(req.flash.ERROR),
        notification = req.flash(req.flash.NOTIFICATION);

    var flash = error || notification || info;
    var production = (req.cookies && req.cookies.debug) ? false : sandbox.helpers.production;

    res.render('register-login', {
      flash: flash,
      token: req.session._csrf,
      layout: 'sub/layout.html',
      referrer: req.flash(req.flash.REFERER) || req.get('referer'),
      root: root,
      'static': sandbox.helpers.urlForStatic('', req.secure),
      show: req.url.indexOf('/register') !== -1 ? 'register' : 'login',
      forgotten: !!req.query.forgotten || !!undefsafe(req, 'body.forgotten'),
      email: req.query.email || undefsafe(req, 'body.email')
    });
  }

  app.get('/login', features.route('sslLogin'), captureRefererForLogin, renderLoginRegister);
  app.get('/register', features.route('sslLogin'), captureRefererForLogin, renderLoginRegister);
  app.post('/login', sessionHandler.checkUserLoggedIn, userHandler.validateLogin, sessionHandler.loginUser, sessionHandler.redirectUserAfterLogin);

  app.post('/account/update', sessionHandler.routeSetHome);
  app.post('/account/delete', sessionHandler.deleteAccount, function (req, res, next) {
    metrics.increment('user.delete');
    next();
  }, redirect('/'));

  app.get('/js/inject-back', function (req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var url = config.features.ad.bsa + '?forwardedip=' + ip;
    request({
      url: url,
      json: true,
    }, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.log(error);
        return res.end();
      }

      var ad = body.ads.filter(function (ad) {
        return !!ad.active;
      }).shift();

      var pixels = (ad.pixel || '').split('||');
      var time = Math.round(Date.now() / 10000) | 0;
      var imgs = pixels.map(function (pixel) {
        return '<img src="' + pixel.replace('[timestamp]', time) + '" height=1 width=1 border=0 style="display:none">';
      });

      res.render('inject-ad.js.html', { layout: false, ad: ad, imgs: imgs });
    })
  });

  // TODO /register should take them through to logged in if the details are correct
  app.post('/register', sessionHandler.checkUserLoggedIn, userHandler.validateRegister, sessionHandler.loginUser, sessionHandler.redirectUserAfterLogin);

  // TODO remove once sslLogin feature has landed
  app.get(['/login', '/register'], function (req, res) {
    res.redirect('http://jsbin.com');
  });

  app.get('/status', function(req, res) {
    res.send('OK');
  });

  app.get('/logout', function (req, res) {
    if (req.session.user) {
      delete req.session.referer;
      var root = sandbox.helpers.url('', true, req.secure);
      var statik = sandbox.helpers.urlForStatic('', req.secure);

      res.render('account/logout', {
        request: req,
        token: req.session._csrf,
        learn: 'http://learn.jsbin.com/',
        layout: 'sub/layout.html',
        root: root,
        'static': statik,
        user: req.session.user
      });
    } else {
      // you're not welcome!
      res.redirect('/');
    }
  });
  app.post('/logout', sessionHandler.logoutUser);
  app.post('/forgot', sessionHandler.forgotPassword);
  app.get('/forgot', sessionHandler.requestToken);
  app.get('/reset', sessionHandler.resetPassword);

  // Admin
  app.get('/admin', features.route('admin'), adminHandler.renderAdmin);
  app.get('/admin/*', features.route('admin'), nextRoute);
  app.post('/admin/flag-bin', features.route('admin'), adminHandler.flagBin);
  app.post('/admin/flag-user', features.route('admin'), adminHandler.flagUser);
  app.post('/admin/user-verified', features.route('admin'), adminHandler.userVerified);

   // TODO update - this is currently only used for updating the user's profile
   // when outside of the SSL login process.
  app.post('/sethome', sessionHandler.routeSetHome);

  // GitHub auth
  app.get('/auth/github', sessionHandler.github);
  app.get('/auth/github/callback', sessionHandler.githubPassportCallback, sessionHandler.githubCallback);

  // DropBox auth
  app.get('/auth/dropbox', features.route('dropbox'), sessionHandler.dropboxAuth);
  app.get('/auth/dropbox/callback', sessionHandler.dropboxPassportCallback, sessionHandler.dropboxCallback);

  // List (note that the :user param is handled inside the getUserBins)
  app.get('/list/:user', time('request.list.specific'), middleware.cors(), binHandler.getUserBins);
  app.get('/list', time('request.list'), binHandler.getUserBins);
  app.get('/show/:user', time('request.homepage'), middleware.cors(), binHandler.getUserBins);
  app.get('/user/:user', time('request.homepage'), middleware.cors(), binHandler.getUserBins);

  // Quick and easy urls for test - allows me to do /rem/last on my mobile devices
  app.param('username', sessionHandler.loadUser);

  // Save
  app.post('/save', time('request.bin.create'), binHandler.createBin);

  // Clone directly via url
  app.get('/clone', time('request.bin.clone'), binParamFromReferer, function (req, res, next) {
    // donkey talk for "create a clone" :(
    req.params.method = 'save,new';
    next();
  }, binHandler.loadBin, function (req, res, next) {
    // TODO remove this middleware and make it easier to clone
    // copy the bin to the body so it looks like it was posted
    req.body = utils.extract(req.bin, 'html', 'css', 'javascript', 'settings');
    req.body.settings = JSON.stringify(req.body.settings);
    next();
  }, binHandler.createRevisionOrClone);


  /** Bin based urls **/

  // tag those urls that are the editor view (useful for the 404s)
  app.get(/\/(edit|watch)$/, redirectOffPreview, secureOutput, tag('editor'), nextRoute);

  // check whether a get request has a subdomain, and whether it should be
  // redirected back to the default host for jsbin
  app.get('*', function (req, res, next) {
    new Promise(function (resolve, reject) {
      if (req.subdomain) {
        var url = parse(req.url);
        if (custom[req.subdomain]) {
          // custom domain (like emberjs, etc)
          return resolve();
        } else if (/(embed|edit|watch|download|source)$/i.test(url.pathname)) {
          return reject('vanity urls not allowed on these urls');
        }
      }

      resolve();
    }).then(function () {
      next('route');
    }).catch(function (reason) {
      // console.error(req.headers.host + ' not allowed: ' + reason);
      res.redirect(sandbox.helpers.url(req.url, true, req.secure));
    });
  });

  // username shortcut routes
  app.get('/:username/last(-:n)?/edit', secureOutput, binHandler.getLatestForUser, binHandler.getBin);
  app.get('/:username/last(-:n)?/watch', binHandler.getLatestForUser, binHandler.live, binHandler.getBin);

  app.post('/:bin/:rev?/transfer', binHandler.ensureOwnership, binHandler.transfer);

  // Edit
  app.get('/:binname/:revision?/edit', secureOutput, binHandler.getBin);
  app.get('/:bin/:rev?/watch', tag('live'), binHandler.getBin);
  app.get('/:bin/:rev?/embed', tag('embed'), function (req, res, next) {
    // special case for embed: if user has SSL, allow it, if bin has SSL allow it
    // otherwise redirect
    if (req.secure && !features('sslForEmbeds', req)) {
      return res.render('ssl-embed', {
        root: req.app.get('url full'),
        'static': sandbox.helpers.urlForStatic(undefined, true),
      });
    }
    next();
  }, binHandler.getBin);

  // don't expose anymore - reporting goes through github
  // app.post('/:bin/:rev?/report', binHandler.report);

  // Use this handler to check for a user creating/claiming their own bin url.
  // We use :url here to prevent loadBin() being called and returning a not
  // found error.
  app.post('/:url/save', time('request.bin.save.claim'), binHandler.claimBin);

  // If the above route fails then it's either a clone or a revision. Which
  // the handler can check in the post body.
  app.post('/:bin/:rev?/save', time('request.bin.update'), binHandler.createRevisionOrClone);
  app.post('/:bin/:rev?/reload', binHandler.reload);

  // delete a bin
  app.post('/:bin/:rev?/delete', time('request.bin.delete'), features.route('delete'), binHandler.delete, function (req, res) {
    res.send(200, true);
  });

  app.post('/:bin/:rev?/delete-all', time('request.bin.delete-all'), features.route('delete'), binHandler.deleteAll);

  // Private
  app.post('/:bin/:rev?/private', binHandler.setBinAsPrivate);
  app.post('/:bin/:rev?/public', binHandler.setBinAsPublic);

  // Archive
  app.post('/:bin/:rev/archive', binHandler.archiveBin.bind(null, true));
  // Unarchive
  app.post('/:bin/:rev/unarchive', binHandler.archiveBin.bind(null, false));

  // Download
  app.get('/download', binParamFromReferer, binHandler.loadBin, binHandler.downloadBin);
  app.get('/:bin/:rev?/download', binHandler.downloadBin);

  // send back a generated service worker
  app.get('/sw.js', nocache, function (req, res) {
    var http = req.secure ? 'https' : 'http';
    var ssl = req.secure;
    var statik = sandbox.helpers.urlForStatic(undefined, ssl);
    var root = sandbox.helpers.url('', true, ssl);
    var version = sandbox.helpers.set('version');
    var runner = sandbox.helpers.runner;

    if (statik && statik.indexOf('https') === 0) {
      // then ensure the runner is also https
      if (runner.indexOf('https') === -1) {
        runner = runner.replace(/http/, 'https');
      }
    }

    res.set('content-type', 'text/javascript');
    res.render('sw.js.html', {
      root: sandbox.helpers.url('', true, req.secure),
      static: statik,
      runner: runner,
      layout: false,
    });
  });

  app.get('/sw-runner.js', nocache, function (req, res) {
    res.set('content-type', 'text/javascript');
    res.render('sw-runner.js.html', {
      root: sandbox.helpers.url('', true, req.secure),
      static: sandbox.helpers.urlForStatic(undefined, true),
      layout: false,
    });
  });


  app.get('/bin/user.js', nocache, function (req, res, next) {
    var userfields = 'avatar name bincount created pro settings';
    var user = _.pick.apply(_, [req.session.user || {}].concat(userfields.split(' ')));

    if (!user.avatar && req.session.user) {
      req.session.user.avatar = user.avatar = req.app.locals.gravatar(req.session.user);
    }

    if (user.avatar) {
      user.large_avatar = req.app.locals.gravatar(req.session.user, 120);
    }

    // all this code is repeated from handler/bin
    // and it totally sucks – RS 2016-06-22
    var http = req.secure ? 'https' : 'http';
    var ssl = req.secure;
    var statik = sandbox.helpers.urlForStatic(undefined, ssl);
    var root = sandbox.helpers.url('', true, ssl);
    var version = sandbox.helpers.set('version');
    var runner = sandbox.helpers.runner;

    if (statik && statik.indexOf('https') === 0) {
      // then ensure the runner is also https
      if (runner.indexOf('https') === -1) {
        runner = runner.replace(/http/, 'https');
      }
    }

    res.set('content-type', 'text/javascript');
    res.render('user', {
      version: version,
      root: root,
      shareRoot: features('vanity', req) ? http + '://' + user.name + '.' + req.app.get('url host') : root,
      runner: runner,
      static: statik,
      user: JSON.stringify(user),
      layout: false,
    })
  });

  // this is the new bin handler - all the content and setup is loaded here
  // allowing us to fully cache the index.html template for offline use
  app.get('/bin/start.js', nocache, function (req, res, next) {
    if (!req.query.new) {
      binParamFromReferer(req, res, function () {});
    }

    var referer = req.headers.referer || '';

    // FIXME these `indexOf` matches are brittle - they also match
    // things like /embedded or /watch-this-bin

    // is this an embedded request?
    if (referer.indexOf('/embed') !== -1) {
      req.embed = true;
    }

    // is this a /null /- sandbox request?
    if (referer.indexOf('/-') !== -1 || referer.indexOf('/null') !== -1) {
      if (features('sandbox', req)) {
        req.sandbox = true;
      }
    }

    // is this a codecasting session?
    if (referer.indexOf('/watch') !== -1) {
      req.live = true;
    }

    var postedBinId = req.flash('postedBin');
    if (postedBinId) {
      req.bin = flash.get(postedBinId);
      return next();
    }

    if (req.params.bin) {
      return binHandler.loadBin(req, res, next);
    }

    return binHandler.getDefault(req, res, next);
  }, binHandler.sendStart);

  // oEmbed
  app.get('/oembed', middleware.cors(), oembedHander.embed);

  /**
   * Full output routes
   */
  // Source
  app.all('*', middleware.cors(), nextRoute);
  app.get('/:bin/:rev?/source', redirectToOutput, time('request.source'), binHandler.getBinSource);

  app.get('/:bin/:rev?.:format(' + Object.keys(processors.mime).join('|') + ')',redirectToOutput, sameoriginframes, time('request.source'), binHandler.getBinSourceFile);
  app.get('/:bin/:rev?/:format(js)', redirectToOutput, sameoriginframes, function (req, res) {
    // Redirect legacy /js suffix to the new .js extension.
    res.redirect(301, req.path.replace(/\/js$/, '.js'));
  });

  // event source based requests
  app.get('/:bin/:rev?/stats', tag('stats'), spike.getStream);
  app.get('/:bin/:rev?', spike.getStream, function (req, res, next) {
    // if we reach this point, then we've hit a regular reqest
    next('route');
  });

  // full output / preview
  app.get('/:username/last(-:n)?/:quiet(quiet)?', redirectToOutput, sameoriginframes, tag('keepLatest'), binHandler.getLatestForUser, spike.getStream, binHandler.getBinPreview);
  app.get('/:bin/:quiet(quiet)?', redirectToOutput, featureByBinOwner('pro', sameoriginframes), binHandler.testPreviewAllowed, spike.getStream, binHandler.getBinPreview);
  app.get('/:bin/:rev?/:quiet(quiet)?', redirectToOutput, ensureRevisionIsInt, featureByBinOwner('pro', sameoriginframes), binHandler.testPreviewAllowed, spike.getStream, binHandler.getBinPreview);

  app.post('/:bin/:rev/settings', binHandler.ensureOwnership, binHandler.updateSettings);
  app.put('/:bin/:rev/settings', binHandler.ensureOwnership, binHandler.updateSettings);

  // used for simple testing
  app.get('/test/error/:num', function (req, res, next) {
    next(req.params.num * 1);
  });

  // Handle failed auth requests.
  app.use(sessionHandler.githubCallbackWithError);

  // Catch all
  app.use(errorHandler.notFound);

  // Error handler.
  app.use(errorHandler.httpError);

  // Final connect error handler when in development.
  app.configure('development', function () {
    app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
  });

  // Final connect error handler when in development.
  app.configure('production', function () {
    app.use(errorHandler.uncaughtError);
  });
};
