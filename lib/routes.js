var express  = require('express'),
    handlers = require('./handlers'),
    models   = require('./models'),
    helpers  = require('./helpers'),
    utils    = require('./utils'),
    spike    = require('./spike'),
    features = require('./features'),
    metrics  = require('./metrics'),
    scripts  = require('../scripts.json');

function tag(label) {
  return function (req, res, next) {
    req[label] = true;
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

  app.get('/about', function (req, res) {
    res.redirect('https://github.com/jsbin/jsbin/blob/master/README.markdown');
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
    next();
  }, binHandler.loadBin);
  app.param('rev', binHandler.loadBinRevision);

  // Set up the routes.
  app.get('/', binHandler.getDefault);
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
    var pages = {
      'editor': 'editor-settings.html',
      'profile': 'profile-settings.html'
    };
    return function renderAccountSettings (req, res) {
      var page = pages[req.param('page')];
      if (!page) {
        res.redirect('back');
      }
      if (!req.session.user) {
        res.redirect('/login');
      }
      var root = sandbox.helpers.url('', true);
      var referrer = req.get('referer');
      res.render(page, {
        token: req.session._csrf,
        layout: 'sub/layout.html',
        referrer: referrer,
        root: root,
        user: req.session.user
      });
    };
  }());

  app.get('/account/:page', features.route('accountPages'), renderAccountSettings);
  app.get('/account', function(req, res) {
    res.redirect('/account/profile');
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
        res.send(400, err);
      }
      req.session.user.settings = req.body.settings;
      console.log(req.session.user.settings);
      res.json(200, { all: 'ok'});
    });
  });

  // Login/Create account.
  function renderLoginRegister(req, res) {
    var root = sandbox.helpers.url('', true, req.secure);
    var static = sandbox.helpers.urlForStatic('', req.secure);
    var referrer = req.get('referer');

    if (req.session.user) {
      res.redirect(root);
    }

    res.render('register-login', {
      token: req.session._csrf,
      layout: 'sub/layout.html',
      referrer: referrer,
      root: root,
      static: static,
      show: req.url.indexOf('/register') !== -1 ? 'register' : 'login',
      learn: 'http://learn.jsbin.com' // TODO move to config setting
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

  // List (note that the :user param is handled inside the getUserBins)
  app.get('/list/:user', binHandler.getUserBins);
  app.get('/list', binHandler.getUserBins);
  app.get('/show/:user', binHandler.getUserBins);
  app.get('/user/:user', binHandler.getUserBins);

  // Latest
  app.get('/:bin/latest((.|\/):format)?', binHandler.redirectToLatest);
  app.get('/:bin/latest/edit', binHandler.redirectToLatest);


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
  app.post('/save', binHandler.createBin);

  // Clone directly via url
  app.get('/clone', binParamFromReferer, function (req, res, next) {
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
  app.post('/:url/save', binHandler.claimBin);

  // If the above route fails then it's either a clone or a revision. Which
  // the handler can check in the post body.
  app.post('/:bin/:rev?/save', binHandler.createRevisionOrClone);
  app.post('/:bin/:rev?/reload', binHandler.reload);

  // delete a bin
  app.post('/:bin/:rev?/delete', features.route('delete'), binHandler.delete);

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
  app.get('/:bin/:rev?/source', binHandler.getBinSource);
  app.get('/:bin/:rev?.:format(js|json|css|html|md|markdown|stylus|less|coffee|jade)', binHandler.getBinSourceFile);
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
