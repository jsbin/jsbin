var express  = require('express'),
    hogan    = require('hogan.js'),
    path     = require('path'),
    fs       = require('fs'),
    app      = express(),
    options  = require('./config'),
    store    = require('./store')(options.store),
    handlers = require('./handlers')(app);

app.store = store;
app.templates = {};

// Apply the keys from the config file.
Object.getOwnPropertyNames(options).forEach(function (key) {
  app.set(key, options[key]);
});

app.set('root', path.resolve(path.join(__dirname, '..')));
app.set('version', require('../package').version);

// Register all the middleware.
app.use(express.logger());
app.use(express.static(path.join(app.set('root'), 'public')));
app.use(express.errorHandler({dumpExceptions: true}));
app.use(express.errorHandler({showStack: true, dumpExceptions: true}));

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
  root: (options.url.ssl ? 'https://' : 'http://') + options.url.host + options.url.prefix,
  version: app.set('version'),
  home: null
});

// Set up the routes.
app.get('/', handlers.getDefault);
app.get('/:bin/edit', handlers.loadBin, handlers.getBin);
app.get('/:bin/:rev/edit', handlers.loadBin, handlers.getBin);
app.get('/:bin/:rev?', handlers.loadBin, handlers.getBinPreview);

app.use(function (err, req, res, next) {
  if (err instanceof handlers.NotFound) {
    return handlers.notFound(req, res);
  }
  next(err);
});

// Export the application to allow it to be included.
module.exports = app;

// Run a local development server if this file is called directly.
if (require.main === module) {
  app.store.connect(function (err) {
    if (err) {
      throw err;
    }
    app.listen(3000);
  });
}
