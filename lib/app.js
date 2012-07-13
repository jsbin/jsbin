var nodemailer = require('nodemailer'),
    express    = require('express'),
    flatten    = require('flatten').flatten,
    path       = require('path'),
    app        = express.createServer(),
    hogan      = require('./hogan'),
    errors     = require('./errors'),
    options    = require('./config'),
    spike      = require('./spike'),
    store      = require('./store')(options.store),
    models     = require('./models'),
    helpers    = require('./helpers'),
    handlers   = require('./handlers'),
    middleware = require('./middleware'),
    mailTransport = nodemailer.createTransport('smtp', options.smtp),
    mailHandler = new handlers.MailHandler(mailTransport, app.render.bind(app)),
    sandbox, sessionHandler, binHandler, flattened;

app.store = store;

app.PRODUCTION  = 'production';
app.DEVELOPMENT = 'development';

// Set the NODE_ENV variable as this is used by Express, we want the
// environment to take precedence but allow it to be set using the config file
// too.
if (process.env.NODE_ENV) {
  options.env = process.env.NODE_ENV;
}
process.env.NODE_ENV = options.env;

// Sort out the port.
(function (url) {
  var port = ''; //process.env.PORT;

  if (!port) {
    url.host.replace(/\:(\d+)$/, function (m, p) {
      if (p.length) {
        port = p;
      }
    });
  }

  if (!port) {
    port = 80;
  }

  if (port !== 80 && url.host.indexOf(':') === -1) {
    url.host += ':' + port;
  }

  url.port = port;
})(options.url);

// Apply the keys from the config file. All nested properties are
// space delimited to match the express style.
//
// For example, app.set('url prefix'); //=> '/'
flattened = flatten(options, ' ');

Object.getOwnPropertyNames(flattened).forEach(function (key) {
  app.set(key, flattened[key]);
});

app.set('root', path.resolve(path.join(__dirname, '..')));
app.set('version', require('../package').version);
app.set('url prefix', options.url.prefix.replace(/\/$/, ''));
app.set('url full', (app.set('url ssl') ? 'https://' : 'http://') + app.set('url host') + app.set('url prefix'));
app.set('basepath', app.set('url prefix'));

if (options.url.static) {
  app.set('static url', (app.set('url ssl') ? 'https://' : 'http://') + app.set('url static'));
} else {
  app.set('static url', app.set('url full'));
}

// Register all the middleware.
app.use(express.logger('tiny'));
app.use(express.static(path.join(app.set('root'), 'public')));
app.use(express.cookieParser(app.set('session secret')));
app.use(express.cookieSession({key: 'jsbin'}));
app.use(express.bodyParser());
app.use(express.csrf());
app.use(middleware.subdomain(app));
app.use(middleware.noslashes());
app.use(middleware.ajax());
app.use(middleware.cors());
app.use(middleware.jsonp());
app.use(middleware.flash());

// A sandbox object to contain some specific objects that are commonly used by
// handlers. In future it would be ideal that each handler only receives the
// objects that it requires.
sandbox = {
  store: store,
  models: models.createModels(store),
  mailer: mailHandler,
  helpers: helpers.createHelpers(app)
};

// Create handlers for accepting incoming requests.
binHandler = new handlers.BinHandler(sandbox);
sessionHandler = new handlers.SessionHandler(sandbox);

app.engine('html', hogan.renderer).engine('txt', hogan.renderer);

// Events

binHandler.on('updated', spike.ping.bind(spike));
binHandler.on('render-scripts', spike.appendScripts.bind(spike));

// Configure the template engine.
app.set('view engine', 'html');
app.set('views', path.join(app.set('root'), 'views'));

// Define some generic template variables.
app.locals({
  version: app.set('version')
});

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

// Final connect in error handler. Ideally should never hit this.
app.use(express.errorHandler({showStack: true, dumpExceptions: true}));

// Export the application to allow it to be included.
module.exports = app;
if (app.set('url prefix') !== '') {
  // If we have a prefix then mount the app within another
  // express app to save us hacking around with the routes.
  module.exports = express().use(app.set('url prefix'), app);
  module.exports.child = app;
}

// Allow exported app to connect.
module.exports.connect = store.connect.bind(store);

// Run a local development server if this file is called directly.
if (require.main === module) {
  module.exports.connect(function (err) {
    if (err) {
      throw err;
    }

    var port = process.env.PORT;
    if (!port) {
      options.url.host.replace(/\:(\d+)$/, function (m, p) {
        if (p.length) {
          port = p;
        }
      });
    }

    if (!port) {
      port = 80;
    }
    process.stdout.write('Running jsbin on port ' + port + '\n');
    module.exports.listen(port);
  });
}
