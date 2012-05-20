var express    = require('express'),
    flatten    = require('flatten').flatten,
    hogan      = require('hogan.js'),
    gobo       = require('gobo'),
    path       = require('path'),
    fs         = require('fs'),
    app        = express(),
    errors     = require('./errors'),
    options    = require('./config'),
    store      = require('./store')(options.store),
    models     = require('./models'),
    handlers   = require('./handlers'),
    middleware = require('./middleware'),
    binHandler = new handlers.BinHandler(),
    sessionHandler = new handlers.SessionHandler(),
    flattened;

app.store  = store;
app.models = models.createModels(store);
app.templates = {};

app.PRODUCTION  = 'production';
app.DEVELOPMENT = 'development';

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
app.set('url full', (options.url.ssl ? 'https://' : 'http://') + options.url.host + options.url.prefix);

// Register all the middleware.
app.use(express.logger());
app.use(express.static(path.join(app.set('root'), 'public')));
app.use(express.cookieParser(app.set('session secret')));
app.use(express.cookieSession({key: 'jsbin'}));
app.use(express.bodyParser());
app.use(express.csrf());
app.use(middleware.noslashes());
app.use(middleware.ajax());
app.use(middleware.cors());
app.use(middleware.jsonp());
app.use(middleware.helpers(app));

// Create a Hogan/Mustache handler for templates.
app.engine('html', function (path, options, fn) {
  fs.readFile(path, 'utf8', function (err, template) {
    if (err) {
      return fn(err);
    }

    try {
      var compiled = app.templates[path];
      if (!compiled) {
        compiled = app.templates[path] = hogan.compile(template);
      }

      fn(null, compiled.render(options));
    } catch (error) {
      fn(error);
    }
  });
});

// Configure the template engine.
app.set('view engine', 'html');
app.set('views', path.join(app.set('root'), 'views'));

// Define some generic template variables.
app.locals({
  root: app.set('url full'),
  version: app.set('version')
});

// Load the bin from the store when encountered in the url. Also handles the
// "latest" url action.
app.param('bin', binHandler.loadBin);

// Set up the routes.
app.get('/', binHandler.getDefault);

// Login/Create account.
app.post('/sethome', sessionHandler.loadUser, sessionHandler.loginUser, sessionHandler.createUser);
app.post('/logout', sessionHandler.logoutUser);

// List
app.get('/list', binHandler.getUserBins);

// Latest
app.get('/:bin/latest((.|\/):format)?', binHandler.redirectToLatest);
app.get('/:bin/latest/edit', binHandler.redirectToLatest);

// Edit
app.get('/:bin/:rev?/edit', binHandler.getBin);

// Save
app.post('/save', binHandler.createBin);
app.post('/:bin/:rev?/save', binHandler.createRevision);

// Source
app.get('/:bin/:rev?/source', binHandler.getBinSource);
app.get('/:bin/:rev?.:format(js|json|css|html)', binHandler.getBinSourceFile);
app.get('/:bin/:rev?/:format(js)', function (req, res) {
  // Redirect legacy /js suffix to the new .js extension.
  res.redirect(301, req.path.replace(/\/js$/, '.js'));
});

// Preview
app.get('/:bin/:quiet(quiet)?', binHandler.getBinPreview);
app.get('/:bin/:rev?/:quiet(quiet)?', binHandler.getBinPreview);

// Serve the concatenated JavaScript.
app.get('/js/debug/jsbin.js', function (req, res) {
  var js = path.join(app.set('root'), 'public', 'js');
  gobo(path.join(js, 'jsbin.js'), 'vendor', function (content) {
    res.contentType('js');
    res.send(content);
  });
});

// Error handler.
app.use(function (err, req, res, next) {
  if (err instanceof errors.NotFound) {
    return binHandler.notFound(req, res);
  }
  next(err);
});

// Final connect in error handler. Ideally should never hit this.
app.use(express.errorHandler({showStack: true, dumpExceptions: true}));

// Export the application to allow it to be included.
module.exports = app;
if (app.set('url prefix') !== '/') {
  // If we have a prefix then mount the app within another
  // express app to save us hacking around with the routes.
  module.exports = express().use(app.set('url prefix'), app);
}

// Run a local development server if this file is called directly.
if (require.main === module) {
  store.connect(function (err) {
    if (err) {
      throw err;
    }

    var port = 80;
    options.url.host.replace(/\:(\d+)$/, function (m, p) {
      if (p.length) {
        port = p;
      } else if (process.env.PORT) {
        port = process.env.PORT;
      }
    });

    console.log('Running jsbin on port ' + port);
    module.exports.listen(port);
  });
}
