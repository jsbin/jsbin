var express  = require('express'),
    handlers = require('./handlers'),
    models   = require('./models'),
    helpers  = require('./helpers'),
    errors   = require('./errors'),
    spike    = require('./spike');


module.exports = function (app) {
  // A sandbox object to contain some specific objects that are commonly used by
  // handlers. In future it would be ideal that each handler only receives the
  // objects that it requires.
  var sandbox = {
    store:   app.store,
    models:  models.createModels(app.store),
    mailer:  app.mailer,
    helpers: helpers.createHelpers(app)
  }, binHandler, sessionHandler, errorHandler;

  // Create handlers for accepting incoming requests.
  binHandler = new handlers.BinHandler(sandbox);
  sessionHandler = new handlers.SessionHandler(sandbox);
  errorHandler = new handlers.ErrorHandler(sandbox);

  // Handler Events

  binHandler.on('updated', spike.ping.bind(spike));
  binHandler.on('render-scripts', spike.appendScripts.bind(spike));

  // Load the bin from the store when encountered in the url. Also handles the
  // "latest" url action.
  app.param('bin', binHandler.loadBin);
  app.param('name', sessionHandler.loadUser);

  // Set up the routes.
  app.get('/', binHandler.getDefault);

  // Login/Create account.
  app.post('/sethome', sessionHandler.routeSetHome);
  app.post('/logout', sessionHandler.logoutUser);
  app.post('/forgot', sessionHandler.forgotPassword);
  app.get('/forgot', sessionHandler.requestToken);
  app.get('/reset', sessionHandler.resetPassword);

  // List
  app.get('/list', binHandler.getUserBins);

  // Latest
  app.get('/:bin/latest((.|\/):format)?', binHandler.redirectToLatest);
  app.get('/:bin/latest/edit', binHandler.redirectToLatest);

  // Quick and easy urls for test - allows me to do /rem/last on my mobile devices
  app.get('/:name/last?/:quiet(quiet)?', binHandler.getLatestForUser, spike.getStream, binHandler.getBinPreview);
  app.get('/:name/last/edit', binHandler.getLatestForUser, binHandler.getBin);
  app.get('/:name/last/watch', binHandler.getLatestForUser, binHandler.live, binHandler.getBin);

  // Edit
  app.get('/:bin/:rev?/edit', binHandler.getBin);
  app.get('/:bin/:rev?/watch', binHandler.live, binHandler.getBin);
  app.get('/:bin/:rev?/embed', binHandler.embed, binHandler.getBin);

  // Save
  app.post('/save', binHandler.createBin);

  // Use this handler to check for a user creating/claiming their own bin url.
  // We use :url here to prevent loadBin() being called and returning a not
  // found error.
  app.post('/:url/save', binHandler.claimBin);

  // If the above route fails then it's either a clone or a revision. Which
  // the handler can check in the post body.
  app.post('/:bin/:rev?/save', binHandler.createRevisionOrClone);

  // Download
  app.get('/:bin/:rev?/download', binHandler.downloadBin);

  // Source
  app.get('/:bin/:rev?/source', binHandler.getBinSource);
  app.get('/:bin/:rev?.:format(js|json|css|html)', binHandler.getBinSourceFile);
  app.get('/:bin/:rev?/:format(js)', function (req, res) {
    // Redirect legacy /js suffix to the new .js extension.
    res.redirect(301, req.path.replace(/\/js$/, '.js'));
  });

  // Log
  app.get('/:bin/:rev/log', spike.getLog);
  app.post('/:bin/:rev/log', spike.postLog);

  // Preview
  app.get('/:bin/:quiet(quiet)?', binHandler.getBinPreview);
  app.get('/:bin/:rev?/:quiet(quiet)?', spike.getStream, binHandler.getBinPreview);

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
