var express = require('express'),
    handlers = require('./handlers'),
    models = require('./models'),
    helpers = require('./helpers'),
    utils = require('./utils'),
    spike = require('./spike'),
    features = require('./features'),
    metrics = require('./metrics'),
    scripts = require('../scripts.json');

function tag(label) {
  return function (req, res, next) {
    req[label] = true;
    next();
  };
}

function time(label) {
  'use strict';
  return function (req, res, next) {
    res.on('header', function () {
      metrics.timing(label, Date.now() - req.start);
      metrics.timing('request', Date.now() - req.start);
    });
    next();
  };
}


module.exports = function (app) {
  // A sandbox object to contain some specific objects that are commonly used by
  // handlers. In future it would be ideal that each handler only receives the
  // objects that it requires.
  var sandbox = {
    store:   app.store,
    models:  models,
    mailer:  app.mailer,
    helpers: helpers.createHelpers(app)
  }, binHandler, sessionHandler, errorHandler, userHandler;

  function binParamFromReferer(req, res, next) {
    var root = app.get('url full');
    var re = new RegExp(root + '/(.*?)/(\\d+)/');

    // only allow cloning via url if it came from jsbin
    if (req.headers.referer.indexOf(root) === 0) {
      var match = req.headers.referer.match(re) || [];
      if (match.length) {
        req.params.bin = match[1];
        req.params.rev = match[2];

        return next();
      }
    }

    next('route');
  }

  // Create handlers for accepting incoming requests.
  binHandler = new handlers.BinHandler(sandbox);
  sessionHandler = new handlers.SessionHandler(sandbox);
  errorHandler = new handlers.ErrorHandler(sandbox);
  userHandler = new handlers.UserHandler(sandbox);

  // Special redirects (to external sources)
  app.get(['/video', '/videos', '/tutorials'], function (req, res) {
    res.redirect('http://www.youtube.com/playlist?list=PLXmT1r4krsTooRDWOrIu23P3SEZ3luIUq');
  });

  // this doesn't get hit in production - it goes via nginx to our learn repo
  app.get('/about', function (req, res) {
    res.redirect('http://jsbin.com/about');
  });

  app.get(['/issues', '/bugs'], function (req, res) {
    res.redirect('https://github.com/jsbin/jsbin/issues/');
  });


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

    next();
  }, binHandler.loadBin);
  app.param('rev', function (req, res, next) {
    var rev = req.params.rev;
    if (!isNaN(rev * 1) || rev === 'latest') {
      next();
    } else {
      next(404);
    }
  }, binHandler.loadBinRevision);

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

  // Set up the routes.
  app.get('/', time('request.root'), binHandler.getDefault);
  app.get('/gist/*', binHandler.getDefault);
  app.post('/', binHandler.getFromPost);

  // sandbox
  app.get(['/-', '/null'], features.route('sandbox'), tag('sandbox'), binHandler.getDefault);

  // Runner
  app.get('/runner', function (req, res) {
    res.render('runner', {
      scripts: app.get('is_production') ? false : scripts.runner,
      static: sandbox.helpers.urlForStatic()
    });
  });

  app.get('/api/:bin/:rev?', binHandler.apiGetBin);
  app.post('/api/save', binHandler.apiCreateBin);
  app.post('/api/:bin/save', binHandler.apiCreateRevision);

  // Account settings
  var renderAccountSettings = (function(){
    var pages = ['editor', 'profile', 'delete', 'preferences'];

    return function renderAccountSettings (req, res) {
      var root = sandbox.helpers.url('', true, req.secure);
      var static = sandbox.helpers.urlForStatic('', req.secure);
      var referrer = req.get('referer');

      console.log(req.param('page'), pages.indexOf(req.param('page')));

      var page = pages.indexOf(req.param('page')) === -1 ? false : req.param('page') + '.html';

      if (!page) {
        return res.redirect('back');
      }
      if (!req.session.user) {
        return res.redirect('/login');
      }

      res.render('account/' + page, {
        token: req.session._csrf,
        layout: 'sub/layout.html',
        referrer: referrer,
        root: root,
        static: static,
        user: req.session.user,
        cacheBust: app.set('is_production') ? '?' + app.set('version') : ''
      });
    };
  }());

  app.get('/account/:page', features.route('accountPages'), renderAccountSettings);
  app.get('/account', function(req, res) {
    res.redirect('/account/editor');
  });

  app.post('/account/editor', features.route('accountPages'), function(req, res, next) {
    if (!req.session || !req.session.user) {
      res.send(400, 'Please log in');
    }
    var settings = req.body.settings;
    for(var prop in settings) {
      if(settings[prop] === 'true' || settings[prop] === 'false') {
        settings[prop] = settings[prop] === 'true' ? true : false;
      }
    }
    sandbox.models.user.updateSettings(req.session.user.name, req.body.settings, function(err, result) {
      if (err) {
        console.log(err);
        res.send(400, err);
      }
      req.session.user.settings = req.body.settings;
      if (typeof req.session.user.settings === 'string') {
        req.session.user.settings = JSON.parse(req.session.user.settings);
      }
      res.json(200, { all: 'ok'});
    });
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

    sandbox.helpers.analytics(function(err, analytics) {
      res.render('register-login', {
        flash: flash,
        token: req.session._csrf,
        layout: 'sub/layout.html',
        referrer: req.get('referer'),
        root: root,
        static: sandbox.helpers.urlForStatic('', req.secure),
        cacheBust: app.set('is_production') ? '?' + app.set('version') : '',
        show: req.url.indexOf('/register') !== -1 ? 'register' : 'login',
        isProduction: production,
        analytics: analytics
      });
    });
  }
  app.get('/login', features.route('sslLogin'), renderLoginRegister);
  app.get('/register', features.route('sslLogin'), renderLoginRegister);
  app.post('/login', sessionHandler.checkUserLoggedIn, userHandler.validateLogin, sessionHandler.loginUser);

  // TODO /register should take them through to logged in if the details are correct
  app.post('/register', sessionHandler.checkUserLoggedIn, userHandler.validateRegister, sessionHandler.loginUser);

  // TODO remove once sslLogin feature has landed
  app.get(['/login', '/register'], function (req, res) {
    res.redirect('http://jsbin.com');
  });

  app.get('/logout', function (req, res) {
    if (req.session.user) {
      var root = sandbox.helpers.url('', true, req.secure);
      var static = sandbox.helpers.urlForStatic('', req.secure);

      res.render('account/logout', {
        token: req.session._csrf,
        learn: 'http://learn.jsbin.com/',
        layout: 'sub/layout.html',
        root: root,
        static: static,
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
  app.get('/list/:user', time('request.list.specific'), binHandler.getUserBins);
  app.get('/list', time('request.list'), binHandler.getUserBins);
  app.get('/show/:user', time('request.homepage'), binHandler.getUserBins);
  app.get('/user/:user', time('request.homepage'), binHandler.getUserBins);

  // Quick and easy urls for test - allows me to do /rem/last on my mobile devices
  app.param('username', sessionHandler.loadUser);

  app.get('/:username/last(-:n)?/:quiet(quiet)?', tag('keepLatest'), binHandler.getLatestForUser, spike.getStream, binHandler.getBinPreview);
  app.get('/:username/last(-:n)?/edit', binHandler.getLatestForUser, binHandler.getBin);
  app.get('/:username/last(-:n)?/watch', binHandler.getLatestForUser, binHandler.live, binHandler.getBin);

  // Edit
  app.get('/:bin/:rev?/edit', binHandler.getBin);
  app.get('/:bin/:rev?/watch', tag('live'), binHandler.getBin);
  app.get('/:bin/:rev?/embed', tag('embed'), binHandler.getBin);

  app.post('/:bin/:rev?/report', binHandler.report);

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


  // Use this handler to check for a user creating/claiming their own bin url.
  // We use :url here to prevent loadBin() being called and returning a not
  // found error.
  app.post('/:url/save', time('request.bin.save.claim'), binHandler.claimBin);

  // If the above route fails then it's either a clone or a revision. Which
  // the handler can check in the post body.
  app.post('/:bin/:rev?/save', time('request.bin.update'), binHandler.createRevisionOrClone);
  app.post('/:bin/:rev?/reload', binHandler.reload);

  // delete a bin
  app.post('/:bin/:rev?/delete', time('request.bin.delete'), features.route('delete'), binHandler.delete);

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

  // Source
  app.get('/:bin/:rev?/source', time('request.source'), binHandler.getBinSource);
  app.get('/:bin/:rev?.:format(js|json|css|html|md|markdown|stylus|less|coffee|jade)', time('request.source'), binHandler.getBinSourceFile);
  app.get('/:bin/:rev?/:format(js)', function (req, res) {
    // Redirect legacy /js suffix to the new .js extension.
    res.redirect(301, req.path.replace(/\/js$/, '.js'));
  });

  // Log
  app.get('/:bin/:rev/log', spike.getLog);
  app.post('/:bin/:rev/log', spike.postLog);

  // Preview
  app.get('/:bin/:quiet(quiet)?', spike.getStream, binHandler.getBinPreview);
  app.get('/:bin/:rev?/:quiet(quiet)?', spike.getStream, binHandler.getBinPreview);
  app.get('/:bin/:rev?/stats', tag('stats'), spike.getStream);

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
