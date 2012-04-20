var express  = require('express'),
    hogan    = require('hogan.js'),
    path     = require('path'),
    fs       = require('fs'),
    app      = express(),
    options  = require('./config'),
    store    = require('./store')(options.store),
    handlers = require('./handlers')(app),
    gobo     = require('../vendor/gobo');

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
app.use(function (req, res, next) {
  // Redirect to urls without trailing slash.
  if (req.path !== '/' && req.path.slice(-1) === '/') {
    res.redirect(301, req.path.slice(0, -1));
  }
  next();
});
app.use(function (req, res, next) {
  // Check for ajax requests and set req.ajax === true.
  req.ajax = false;
  if ((req.get('X-Requested-With') || '').toLowerCase() === 'xmlhttprequest') {
    req.ajax = true;
  }
  next();
});
app.use(function (req, res, next) {
  // Transparently handle JSONP.
  var _send = res.send;
  res.send = function (body) {
    var callback = req.param('callback'),
        isJSONP = res.get('Content-Type') === 'application/json' && callback;

    if (body && req.method !== 'HEAD' && isJSONP) {
      res.contentType('js');
      body = callback + '(' + body.toString().trim() + ');';
    }
    _send.call(this, body);
  };
  next();
});

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

// Load the bin from the store when encountered in the url. Also handles the
// "latest" url action.
app.param('bin', handlers.loadBin);

// Set up the routes.
app.get('/', handlers.getDefault);

// Latest
app.get('/:bin/latest(.|/):format?', handlers.redirectToLatest);
app.get('/:bin/latest/edit', handlers.redirectToLatest);

// Edit
app.get('/:bin/:rev?/edit', handlers.getBin);

// Source
app.get('/:bin/:rev?/:format(source)', handlers.getBinSource);
app.get('/:bin/:rev?.:format(js|json|css|html)', handlers.getBinSource);
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
