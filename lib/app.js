var nodemailer = require('nodemailer'),
    express    = require('express'),
    flatten    = require('flatten.js').flatten,
    path       = require('path'),
    app        = express(),
    hogan      = require('./hogan'),
    options    = require('./config'),
    spike      = require('./spike'),
    store      = require('./store')(options.store),
    routes     = require('./routes'),
    handlers   = require('./handlers'),
    middleware = require('./middleware'),
    metrics    = require('./metrics'),
    url        = require('url'),
    github     = require('./github')(options), // if used, contains github.id
    flattened;

/**
 * JS Bin configuration
 */

app.store  = store;
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

// make features a nested object (though goes against "express style")
// issue filed for refactor: https://github.com/remy/jsbin/issues/865
app.set('features', options.features);

// in live, we run behind a proxy - so this will give us our IPs again:
// http://expressjs.com/guide.html#proxies
if (process.env.NODE_ENV === app.PRODUCTION || process.env.JSBIN_PROXY) {
  app.enable('trust proxy');
}

app.set('root', path.resolve(path.join(__dirname, '..')));
app.set('version', require('../package').version);

app.set('view engine', 'html');
app.set('views', path.join(app.set('root'), 'views'));
app.set('url prefix', options.url.prefix);
app.set('url ssl', options.url.ssl);
app.set('url full', (app.set('url ssl') ? 'https://' : 'http://') + app.set('url host') + app.set('url prefix'));
app.set('basepath', app.set('url prefix'));
app.set('is_production', app.get('env') === app.PRODUCTION);

if (options.url.static) {
  app.set('static url', (app.set('url ssl') ? 'https://' : 'http://') + app.set('url static'));
} else {
  app.set('static url', app.set('url full'));
}

if (options.url.runner) {
  // strip trailing slash, just in case
  options.url.runner = options.url.runner.replace(/\/$/, '');
  app.set('url runner', options.url.runner);
} else {
  app.set('url runner', app.set('url full'));
}

app.engine('html', hogan.renderer).engine('txt', hogan.renderer);

// Define some generic template variables.
app.locals({
  version: app.set('version'),
  client: options.client
});

app.connect = function (callback) {
  app.emit('before', app);

  // Register all the middleware.
  app.configure(function () {
    var mount = app.set('url prefix') || '/',
        logger;

    logger = process.env.JSBIN_LOGGER || app.set('server logger') || 'tiny';

    if (logger !== 'none') {
      app.use(express.logger(logger));
    }

    // Redirect gist.jsbin urls to /gist/:id
    app.use(function (req, res, next) {
      if (req.headers.host.match(/gist.jsbin/)) {
        var parsedUrl = url.parse(req.originalUrl),
            segments = parsedUrl.pathname.split('/'),
            gistId = segments.slice(-1).join('');
        return res.redirect((app.get('url ssl') ? 'https://' : 'http://') + options.url.host + '/gist/' + gistId);
      }
      next();
    });
    app.use(mount, express.static(path.join(app.set('root'), 'public')));
    app.use(middleware.limitContentLength({limit: app.set('max-request-size')}));
    app.use(express.cookieParser(app.set('session secret')));
    app.use(express.cookieSession({
      key: 'jsbin',
      cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000
        // domain: '.' + app.set('url host')
      }
    }));
    // If we're in SSL mode but an insecure connection comes in, redirect to
    // the SSL version (removing any port information)
    app.use(function (req, res, next) {
      if (app.get('url ssl') && !req.secure) {
        return res.redirect('https://' + req.headers.host.replace(/:.*/, '') + req.url);
      }
      next();
    });
    // Passport
    if (options.github && options.github.id) {
      github.initialize(app);
    }
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(middleware.csrf({ ignore: ['/', /^\/api\//] }));
    app.use(middleware.api({ app: app }));
    app.use(middleware.subdomain(app));
    app.use(middleware.noslashes());
    app.use(middleware.ajax());
    app.use(middleware.cors());
    app.use(middleware.jsonp());
    app.use(middleware.flash());
    app.use(mount, app.router);

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
    module.exports.listen(port);

    if (typeof callback === 'function') {
      callback();
    }
    app.emit('connected');

    process.stdout.write('JS Bin v' + app.set('version') + ' is up and running on port ' + app.set('port') + '. Now point your browser at ' + app.set('url full') + '\n');
  });
};

// Export the application to allow it to be included.
module.exports = app;

// Run a local development server if this file is called directly.
if (require.main === module) {
  app.connect();
}
