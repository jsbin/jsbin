'use strict';
global.Promise = require('promise'); // expose

var nodemailer  = require('nodemailer'),
    express     = require('express'),
    flatten     = require('flatten.js').flatten,
    path        = require('path'),
    app         = express(),
    hbs         = require('./hbs'),
    options     = require('./config'),
    openshift   = require('./addons/openshift')(options), // injects options from openshift env vars
    store       = require('./store')(options.store),
    undefsafe   = require('undefsafe'),
    models      = require('./models').createModels(store),
    routes      = require('./routes'),
    handlers    = require('./handlers'),
    middleware  = require('./middleware'),
    helpers     = require('./helpers'),
    metrics     = require('./metrics'),
    github      = require('./github')(options), // if used, contains github.id
    _           = require('underscore'),
    crypto      = require('crypto'),
    filteredCookieSession = require('express-cookie-blacklist'),
    sessionVersion = require('./session-version'),
    stripeRoutes  = require('./stripe')(options),
    flattened;

function generateSessionSecret() {
  console.log('Warning: Generating a session key - please see http://jsbin.com/help/session-secret');
  return crypto.createHash('md5').update(Math.random() + '').digest('hex');
}

/**
 * JS Bin configuration
 */

app.store  = store;
app.sessionVersion = sessionVersion;
// Create model singletons
// models.createModels(store);

app.mailer = (function (mail) {
  var mailTransport = null,
      method   = mail && mail.adapter,
      settings = mail && mail[method];

  if (method && options) {
    mailTransport = nodemailer.createTransport(method, settings);
  }

  return new handlers.MailHandler(mailTransport, app.render.bind(app));
})(options.mail);

app.PRODUCTION  = 'production';
app.DEVELOPMENT = 'development';

// Set the NODE_ENV variable as this is used by Express, we want the
// environment to take precedence but allow it to be set using the config file
// too.
if (process.env.NODE_ENV) {
  options.env = process.env.NODE_ENV;
}
process.env.NODE_ENV = options.env;

// Need to set the node environment to run in the same timezone as the database
// This will ideally be UTC in both cases but if not this can be set either
// using the TZ environment variable or the "timezone" option.
// This is because the mysql library coerces MySQL dates (without timezones)
// into JavaScript date objects.
if (!process.env.TZ && options.timezone) {
  process.env.TZ = options.timezone;
}

// Sort out the port.
(function () {
  var port = process.env.PORT;

  // if we're running from the bin/jsbin file, then we modify
  // both the listen port AND the options.url
  if (process.env.JSBIN_PORT) {
    if (options.url.host.indexOf(':') === -1) {
      options.url.host += ':' + process.env.JSBIN_PORT;
    } else {
      options.url.host = options.url.host.replace(/\:\d+$/, function () {
        return ':' + process.env.JSBIN_PORT;
      });
    }
  }

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

  // NOTE: this is *only* used for running the server.listen()
  // it's not used in the urls to access assets, etc.
  options.port = port;
})();

// Strip trailing slash from the prefix
options.url.prefix = options.url.prefix.replace(/\/$/, '');


// Apply the keys from the config file. All nested properties are
// space delimited to match the express style.
//
// For example, app.set('url prefix'); //=> '/'
flattened = flatten(options, ' ');

Object.getOwnPropertyNames(flattened).forEach(function (key) {
  app.set(key, flattened[key]);
});

// in live, we run behind a proxy - so this will give us our IPs again:
// http://expressjs.com/guide.html#proxies
if (process.env.NODE_ENV === app.PRODUCTION || process.env.JSBIN_PROXY) {
  app.enable('trust proxy');
}

app.disable('x-powered-by');

app.set('root', path.resolve(path.join(__dirname, '..')));

// ensure jsbin is running from the expected root
process.chdir(app.get('root'));

app.set('version', require('../package').version);

app.set('url prefix', options.url.prefix);
app.set('url ssl', options.url.ssl);
app.set('url full', 'http://' + app.get('url host') + app.get('url prefix'));
app.set('basepath', app.get('url prefix'));
app.set('is_production', app.get('env') === app.PRODUCTION);

if (options.url.static) {
  app.set('static url', 'http://' + app.get('url static'));
} else {
  app.set('static url', app.get('url full'));
}

if (options.url.runner) {
  // strip trailing slash, just in case
  options.url.runner = options.url.runner.replace(/\/$/, '');
  app.set('url runner', options.url.runner);
} else {
  app.set('url runner', app.get('url full'));
}

app.set('views', 'views');
app.set('view engine', 'html');

app.engine('html', hbs.express3({
  extname: '.html',
  // defaultLayout: path.resolve(__dirname + '/../views/layout.html'),
  partialsDir: [
    path.resolve(__dirname + '/../views/partials')
  ]
}));

app.engine('txt', hbs.express3({
  extname: '.txt',
  // defaultLayout: path.resolve(__dirname + '/../views/layout.txt'),
  partialsDir: [
    path.resolve(__dirname + '/../views/partials')
  ]
}));

// Define some global template variables.
var helpers = helpers.createHelpers(app);
app.locals.version = app.get('version');
app.locals.client = app.get('client');
Object.keys(helpers).forEach(function (key) {
  app.locals[key] = helpers[key];
});

// set these as global template variables since they keep getting missed
app.locals.is_production = app.get('is_production');
app.locals.cachebust = app.locals.cacheBust = app.get('is_production') ? '?' + app.get('version') : '';

if (!app.get('session secret')) {
  app.set('session secret', generateSessionSecret());
}

app.connect = function (callback) {
  app.emit('before:connect', app);

  // Register all the middleware.
  app.configure(function () {
    var mount = app.set('url prefix') || '/',
        logger;

    logger = process.env.JSBIN_LOGGER || app.get('server logger') || 'tiny';

    if (logger !== 'none') {
      app.use(express.logger(logger));
    }

    // favicon
    app.use(express.favicon(path.join(__dirname, '../', 'public','images','favicon.png')));

    app.use(function (req, res, next) {
      // used for timings
      req.start = Date.now();
      next();
    });
    app.emit('before:middleware');

    app.use(middleware.flash());

    // this middleware says:
    // a) if we have a static url in our config, i.e. static.jsbin.com
    // b) only serve static assets IF AND ONLY IF, the full url is requested,
    //    i.e. static.jsbin.com/css/style.css
    // c) otherwise, skip the static handler, and go straight to routes.js
    //
    // If the request hits routes.js and doesn't match a defined route (or doesn't
    // look like a bin url) then it gets 404'd - i.e. you can't request /css/style.css
    // because it'll return a 404.
    app.use(mount, (function () {
      var staticRouter = express.static(path.join(app.get('root'), 'public'),
        {maxAge: (options['max-age'] || 86400) * 1000});

      return function (req, res, next) {
        // construct the full request url
        var url = req.protocol + '://' + req.get('host') + req.url;

        // *if* the config has a static url path (i.e. different from jsbin.com),
        // i.e. static.jsbin.com
        if (options.url.static) {
          // and the url requested is NOT static, then continue with node
          if (url.indexOf(options.url.static) === -1) {
            return next();
          }
        }
        // otherwise serve it as a static asset...
        return staticRouter(req, res, next);
      };
    })());

    app.use(middleware.limitContentLength({limit: app.get('max-request-size')}));

    app.emit('before:cookies', { app: app });

    app.use(express.cookieParser(app.get('session secret')));
    app.use(filteredCookieSession(['user.settings', 'passport', 'user.email', 'user.github_id', 'user.github_token', 'user.dropbox_token', 'user.dropbox_id', 'user.flagged', 'user.bincount', 'user.api_key', 'user.key', 'user.id', 'user.embed']));
    app.use(express.cookieSession({
      key: 'jsbin',
      cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        // the domain must contain a dot and should not have a port
        domain: app.get('url host').indexOf('.') === -1 ? undefined : '.' + app.get('url host').replace(/:\d+$/, '')
      }
    }));

    app.emit('before:session', {app: app});

    // memcached sessions
    if (options.session.memcached && options.session.memcached.connection) {
      require('./addons/memcached')(app, options.session.memcached.connection);
    }

    if (options.url.host !== 'jsbin.com') {
      require('./ping');
    }

    app.emit('after:session', {app: app});

    app.use(function (req, res, next) {
      // Deletes cookies using the old domain (without the leading '.')
      // and we know this because they don't have a version in their cookie.
      if (undefsafe(req, 'session.version') === undefined) {
        var oldSess = _.extend({ version: app.get('version') }, req.session);
        res.clearCookie('jsbin');
        req.session = oldSess;
      }

      next();
    });

    // Passport
    if (options.github && options.github.id) {
      github.initialize(app);
    }
    if (options.dropbox && options.dropbox.id) {
      require('./dropbox')(options).initialize();
    }
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(middleware.csrf({ ignore: ['/', /^\/api\//, /^\/hooks\//, /^\/subscribe\//] }));
    app.use(middleware.api({ app: app }));
    app.use(middleware.subdomain(app));
    app.use(middleware.noslashes());
    app.use(middleware.protectServiceWorker({ allowed: ['/sw.js', '/sw-runner.js' ]}));
    app.use(middleware.ajax());
    // app.use(middleware.cors());
    app.use(middleware.jsonp());
    app.use(middleware.protocolCheck);
    app.use(middleware.decompressBody);
    app.use(middleware.notices());
    app.use(middleware.nofollow({
      allowed: ['/']
    }));

    app.emit('before:router', app);
    app.use(mount, app.router);

    // All routes must be registered after middleware
    // Register stripe webhooks
    if (options.payment && options.payment.stripe && options.store.adapter === 'mysql') {
      stripeRoutes(app);
    }
    // Register all routes
    routes(app);

  });

  app.emit('after', app);

  store.connect(function (err) {
    if (err) {
      metrics.increment('error.store.connect');
      throw err;
    }

    var port = app.set('port');
    app.listen(port, options.host);	// options.host can be empty, meaning "bind to all network interfaces"

    if (typeof callback === 'function') {
      callback();
    }
    app.emit('connected');

    process.stdout.write('JS Bin v' + app.get('version') + ' is up and running on port ' + app.get('port') + '. Now point your browser at ' + app.get('url full') + '\n');
  });
};

// Export the application to allow it to be included.
module.exports = { app: app };

// Run a local development server if this file is called directly.
if (require.main === module) {
  app.connect();
}
