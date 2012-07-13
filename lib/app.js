var nodemailer = require('nodemailer'),
    express    = require('express'),
    flatten    = require('flatten').flatten,
    path       = require('path'),
    app        = express.createServer(),
    hogan      = require('./hogan'),
    options    = require('./config'),
    spike      = require('./spike'),
    store      = require('./store')(options.store),
    routes     = require('./routes'),
    handlers   = require('./handlers'),
    middleware = require('./middleware'),
    mailTransport = nodemailer.createTransport('smtp', options.smtp),
    mailHandler = new handlers.MailHandler(mailTransport, app.render.bind(app)),
    flattened;

app.store  = store;
app.mailer = mailHandler;

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
(function () {
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

  options.port = port;
})();

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
app.set('view engine', 'html');
app.set('views', path.join(app.set('root'), 'views'));
app.set('url prefix', options.url.prefix.replace(/\/$/, ''));
app.set('url full', (app.set('url ssl') ? 'https://' : 'http://') + app.set('url host') + app.set('url prefix'));
app.set('basepath', app.set('url prefix'));

if (options.url.static) {
  app.set('static url', (app.set('url ssl') ? 'https://' : 'http://') + app.set('url static'));
} else {
  app.set('static url', app.set('url full'));
}

app.engine('html', hogan.renderer).engine('txt', hogan.renderer);

// Define some generic template variables.
app.locals({
  version: app.set('version')
});

// Register all the middleware.
app.configure(function () {
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
  app.use(app.router);

  // Register all routes
  routes(app);
});

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

    var port = app.set('port');
    process.stdout.write('Running jsbin on port ' + port + '\n');
    module.exports.listen(port);
  });
}
