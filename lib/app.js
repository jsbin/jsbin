var express = require('express'),
    hogan   = require('hogan.js'),
    path    = require('path'),
    fs      = require('fs'),
    app     = express();

app.root = path.resolve(path.join(__dirname, '..'));
app.templates = {};

app.use(express.logger());
app.use(express.static(path.join(app.root, 'public')));

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
app.set('views', path.join(app.root, 'views'));

app.get('/', function (req, res) {
  res.render('index', {
    title: 'Users'
  });
});

module.exports = app;

// Run a local development server if this file is called directly.
if (require.main === module) {
  app.listen(3000);
}
