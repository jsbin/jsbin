var handlers = require('./handlers'),
    models   = require('./models'),
    helpers  = require('./helpers'),
    errors     = require('./errors'),
    spike      = require('./spike');


module.exports = function (app) {
  // A sandbox object to contain some specific objects that are commonly used by
  // handlers. In future it would be ideal that each handler only receives the
  // objects that it requires.
  var sandbox = {
    store:   app.store,
    models:  models.createModels(app.store),
    mailer:  app.mailer,
    helpers: helpers.createHelpers(app)
  }, binHandler, sessionHandler;

  // Create handlers for accepting incoming requests.
  binHandler = new handlers.BinHandler(sandbox);
  sessionHandler = new handlers.SessionHandler(sandbox);

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
  app.get('/:name/last/watch', binHandler.getLatestForUser, binHandler.getLiveEditBin);

  // Edit
  app.get('/:bin/:rev?/edit', binHandler.getBin);
  app.get('/:bin/:rev?/watch', binHandler.getLiveEditBin);

  // Save
  app.post('/save', binHandler.createBin);
  app.post('/:bin/:rev?/save', binHandler.createRevision);

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


  // Error handler.
  app.use(function (err, req, res, next) {
    if (err instanceof errors.NotFound) {
      return binHandler.notFound(req, res);
    } else if (err instanceof errors.HTTPError) {
      res.statusCode = err.status;

      if (req.accepts('html')) {
        res.contentType('html');
        res.send(err.toHTMLString());
      } else if (req.accepts('json')) {
        res.json(err);
      } else {
        res.contentType('txt');
        res.send(err.toString());
      }

      return;
    }
    next(err);
  });
};
