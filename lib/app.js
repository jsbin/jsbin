var options = require('./config'),
    store   = require('./store')(options.store),
    express = require('express'),
    hogan   = require('hogan.js'),
    path    = require('path'),
    fs      = require('fs'),
    app     = express();

app.templates = {};

// Apply the keys from the config file.
Object.getOwnPropertyNames(options).forEach(function (key) {
  app.set(key, options[key]);
});

app.set('root', path.resolve(path.join(__dirname, '..')));
app.set('version', require('../package').version);

app.use(express.logger());
app.use(express.static(path.join(app.set('root'), 'public')));

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

app.set('view engine', 'html');
app.set('views', path.join(app.set('root'), 'views'));

app.locals({
  root: (options.url.ssl ? 'https://' : 'http://') + options.url.host + options.url.prefix,
  version: app.set('version'),
  home: null
});

function renderIndex(req, res, bin) {
  var template = {
    css: bin.css || '',
    html: bin.html || '',
    javascript: bin.javascript || ''
  };

  // Very temporary render for the index file.
  res.render('index', {
    tips: '{}',
    revision: bin.revision || 1,
    json_template: JSON.stringify(template),
    version: app.set('environment') === 'production' ? app.set('version') : 'debug'
  });
}

app.get('/', function (req, res) {
  renderIndex(req, res, {});
});

app.get('/:bin/:rev?', function (req, res) {
  var rev = parseInt(req.params.rev, 10) || 1;
  store.connect(function () {
    store.getBin({id: req.params.bin, revision: rev}, function (err, result) {
      renderIndex(req, res, result);
    });
  });
});

module.exports = app;

// Run a local development server if this file is called directly.
if (require.main === module) {
  app.listen(3000);
}
