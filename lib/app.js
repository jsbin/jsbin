var express    = require('express'),
    hogan      = require('hogan.js'),
    gobo       = require('gobo'),
    path       = require('path'),
    fs         = require('fs'),
    app        = express(),
    options    = require('./config'),
    store      = require('./store')(options.store),
    handlers   = require('./handlers'),
    middleware = require('./middleware');

app.store = store;
app.templates = {};

// TODO: Refactor this!
handlers = handlers(app);

// Apply the keys from the config file.
Object.getOwnPropertyNames(options).forEach(function (key) {
  // TODO: Convert nested objects into space separated keys
  app.set(key, options[key]);
});

app.set('root', path.resolve(path.join(__dirname, '..')));
app.set('version', require('../package').version);
app.set('url full', (options.url.ssl ? 'https://' : 'http://') + options.url.host + options.url.prefix);

// Register all the middleware.
app.use(express.logger());
app.use(express.static(path.join(app.set('root'), 'public')));
app.use(express.bodyParser());
app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
app.use(middleware.noslashes());
app.use(middleware.ajax());
app.use(middleware.jsonp());

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
  version: app.set('version'),
  home: null
});

// Load the bin from the store when encountered in the url. Also handles the
// "latest" url action.
app.param('bin', handlers.loadBin);

// Set up the routes.
app.get('/', handlers.getDefault);

// Latest
app.get('/:bin/latest((.|\/):format)?', handlers.redirectToLatest);
app.get('/:bin/latest/edit', handlers.redirectToLatest);

// Edit
app.get('/:bin/:rev?/edit', handlers.getBin);

// Save
app.post('/save', handlers.createBin);
app.post('/:bin/:rev?/save', handlers.createRevision);

// Source
app.get('/:bin/:rev?/source', handlers.getBinSource);
app.get('/:bin/:rev?.:format(js|json|css|html)', handlers.getBinSourceFile);
app.get('/:bin/:rev?/:format(js)', function (req, res) {
  // Redirect legacy /js suffix to the new .js extension.
  res.redirect(301, req.path.replace(/\/js$/, '.js'));
});

// Preview
app.get('/:bin/:rev?', handlers.getBinPreview);

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
