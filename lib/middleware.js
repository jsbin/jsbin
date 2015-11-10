'use strict';
var utils   = require('./utils'),
    errors  = require('./errors'),
    connect = require('express/node_modules/connect'),
    models  = require('./models'),
    config  = require('./config'),
    features = require('./features'),
    LZString = require('lz-string'),
    undefsafe = require('undefsafe'),
    parse = require('url').parse;

// Custom middleware used by the application.
var middleware = module.exports = {
  // Transparently handle JSONP. Although this does require wrapping the
  // Request#send() method which is a bit nasty. Other alternative is to
  // always pass the response on and include this middleware after the
  // routes.
  jsonp: function () {
    return function (req, res, next) {
      var _send = res.send;
      res.send = function (body) {
        var callback = req.param('callback'),
            isJSONP  = res.get('Content-Type') === 'application/json' && callback;

        if (body && req.method !== 'HEAD' && isJSONP) {
          res.contentType('js');
          body = callback + '(' + body.toString().trim() + ');';
        }
        _send.call(this, body);
      };
      next();
    };
  },
  // attach the requesting IP
  // Check for ajax requests and set the Request/Response#ajax flag to true.
  ajax: function () {
    return function (req, res, next) {
      req.ajax = res.ajax = utils.isAjax(req);

      // if ((req.get('X-Stream') || '').toLowerCase() === 'true') {
      //   req.ajax = false;
      // }

      next();
    };
  },
  // Add relevant CORS headers for the application.
  cors: function () {
    return function (req, res, next) {
      var headers = req.header('Access-Control-Request-Headers');
      var origin = req.header('Origin');

      // TODO should this check if the request is via the API?
      if (req.method === 'OPTIONS' || (req.method === 'GET' && req.headers.origin)) {
        res.header({
          'Access-Control-Allow-Origin':  origin,
          'Access-Control-Allow-Headers': headers,
          'Access-Control-Allow-Credentials': 'true'
        });
        req.cors = true;
      }

      if (req.method === 'OPTIONS') {
        res.send(204);
      } else {
        next();
      }
    };
  },
  flash: function () {
    function flash(key, message) {
      // `this` refers to the request object
      // jshint validthis:true
      var cache = this.flashCache = this.flashCache || {},
          value;

      // We store the flash on the session whenever we can
      // However, if we send a flash message before sessions exist
      // i.e in run.js, we store on the req object.
      // the cache object starts on the request, and if it is empty
      // and a session exists we then move it to teh session.
      if (Object.keys(cache).length === 0 && this.session) {
        if (!this.session.flashCache) {
          this.session.flashCache = {};
        }
        cache = this.session.flashCache;
      }

      if (arguments.length === 2) {
        cache[key] = message;
        return this;
      } else if (arguments.length === 1) {
        value = cache[key];
        delete cache[key];
        return value;
      }

      this.flashCache = this.session.flashCache = {};
      return cache;
    }

    return function (req, res, next) {
      req.flash = res.flash = flash.bind(req);

      req.flash.INFO = 'info';
      req.flash.ERROR = 'error';
      req.flash.NOTIFICATION = 'notification';
      req.flash.REFERER = 'referer';

      next();
    };
  },
  // Redirect urls with trailing slashes to their non-trailing counterpart,
  // requires the "strict routing" setting to be false.
  noslashes: function () {
    return function (req, res, next) {
      if (req.path !== '/' && req.originalUrl.slice(-1) === '/') {
        middleware.cors(req, res, function () {
          return res.redirect(301, req.originalUrl.slice(0, -1));
        });
      }
      next();
    };
  },
  // monkey patch for express' own csrf method, so we can ignore specific url patterns
  csrf: function (options) {
    var ignore = options.ignore || [],
        csrf = connect.csrf(options),
        always = {OPTIONS: 1, GET: 1, HEAD: 1};

    return function (req, res, next) {
      if (always[req.method]) {
        return csrf(req, res, next);
      } else {
        var url = parse(req.url);
        var skipCSRF = false;
        ignore.forEach(function(matcher) {
          if (typeof matcher === 'string') {
            if (matcher === url.pathname) {
              skipCSRF = true;
            }
          } else {
            // regular expression matcher
            if (url.pathname.match(matcher)) {
              skipCSRF = true;
            }
          }
        });

        if (skipCSRF) {
          next();
        } else {
          return csrf(req, res, next);
        }
      }
    };
  },
  // Checks for a subdomain in the current url, if found it sets the
  // req.subdomain property. This supports existing behaviour that allows
  // subdomains to load custom config files.
  subdomain: function () {
    return function (req, res, next) {
      var apphost = config.url.host,
          outputHost = undefsafe(config, 'security.preview'),
          host = req.header('Host', ''),
          offset = host.indexOf(apphost);

      if (host === outputHost) {
        offset = host.indexOf(outputHost);
      }

      if (offset > 0) {
        // Slice the host from the subdomain and subtract 1 for
        // trailing . on the subdomain.
        req.subdomain = host.slice(0, offset - 1);
      }
      next();
    };
  },

  // Limit the file size that can be uploaded.
  limitContentLength: function (options) {
    // Parse a string representing a file size and convert it into bytes.
    // A number on it's own will be assumed to be bytes. A multiple such as
    // "k" or "m" can be appended to the string to handle larger numbers. This
    // is case insensitive and uses powers of 1024 rather than (1000).
    // So both 1kB and 1kb == 1024.
    function parseLimit(string) {
      var matches = ('' + string).toLowerCase().match(regexp),
          bytes = null, power;

      if (matches) {
        bytes = parseFloat(matches[1]);
        power = powers[matches[2]];

        if (bytes && power) {
          bytes = Math.pow(bytes * 1024, power);
        }
      }

      return bytes || null;
    }

    var powers = { k: 1, m: 2, g: 3, t: 4 },
        regexp = /^(\d+(?:.\d+)?)\s*([kmgt]?)b?$/,
        limit  = options && parseLimit(options.limit);

    return function (req, res, next) {
      if (limit) {
        var contentLength = parseInt(req.header('Content-Length', 0), 10),
            message = 'Sorry, the content you have uploaded is larger than JS Bin can handle. Max size is ' + options.limit;

        if (limit && contentLength > limit) {
          return next(new errors.RequestEntityTooLarge(message));
        }
      }
      next();
    };
  },

  // detect if this is an API request and add flag isApi to the request object
  api: function(options) {
    return function (req, res, next) {
      var apiKey,
          userModel = models.user;

      if (req.url.indexOf('/api') === 0) {
        req.isApi = true;

        // Make the API requests stateless by removin the cookie set by middleware cookieSession
        res.on('header', function() {
          res.removeHeader('Set-Cookie');
        });

        if (config.api.requireSSL) {
          if (!req.secure && (String(req.headers['x-forwarded-proto']).toLowerCase() !== "https") ) {
            res.status(403); // forbidden
            res.json({ error: 'All API requests must be made over SSL/TLS' });
            return;
          }
        }

        if (req.query.api_key) {
          req.apiKey = req.query.api_key;
        } else if (req.headers.authorization) {
          req.apiKey = req.headers.authorization.replace(/token\s/i,'');
        }

        var validateApiRequest = function() {
          if (config.api.allowAnonymousReadWrite || (config.api.allowAnonymousRead && req.method === 'GET')) {
            next();
          } else {
            if (!req.apiKey) {
              res.status(403); // forbidden
              res.json({ error: 'You need to provide a valid API key when using this API' });
            } else {
              next();
            }
          }
        };

        if (req.apiKey) {
          userModel.loadByApiKey(req.apiKey, function (err, user) {
            if (err) {
              return next(err);
            }
            if (user) {
              req.session.user = user;

              // since we're setting the user session via the API
              // we need to ensure that the user is totally trashed
              // from the session to avoid abuse directly in the browser
              // i.e. stolen api key can only create bins, nothing more.
              res.on('header', function () {
                delete req.session;
              });

              validateApiRequest();
            } else {
              res.status(403); // forbidden
              res.json({ error: 'The API key you provided is not valid' });
            }
          });
        } else {
          validateApiRequest();
        }
      } else {
        next();
      }
    };
  },
  protocolCheck: function(req, res, next) {
    // this is a bit of a hack, because the protocolCheck should be supported
    // no matter what, but since we're using feature flags, this gets very
    // messy when it goes live without the feature flag test in place.
    if (!features('sslLogin', req)) {
      return next();
    }
    var pathShouldBeSecure = pathIsSSL(parse(req.url).pathname);
    var sslSupported = features('sslForAll', req);

    // var useSSL = pathShouldBeSecure || forceSSL;

    if (!config.url.ssl) {
      if (req.secure) {
        // if the request is https and we don't have a https host available in our config
        return res.redirect('http://' + req.headers.host.replace(/:.*/, '') + req.url);
      }
    } else {
      // we do have https host in our config
      if (req.secure) {
        // we are using SSL...
        if (sslSupported) {
          return next();
        }

        if (pathShouldBeSecure === false) {
          req.shouldNotBeSecure = true;
        }
      } else {
        if (pathShouldBeSecure) {
          // if the request is not https and _should be_, redirect to https
          return res.redirect('https://' + req.headers.host.replace(/:.*/, '') + req.url);
        }
      }
    }
    next();
  },
  notices: function () {
    var notices = require('../public/notices');
    var version = require('../package').version;
    var versionTest = require('./session-version');

    return function (req, res, next) {
      var cookieVersion = versionTest(req);

      var matches = notices.filter(function (notice) {
        return cookieVersion.lt(notice.version);
      });

      /* TODO: return latest error messages as the priority */
      // if (matches.length > 1) {
      //   // find the latest error
      //   var errors = matches.filter(function (m) {
      //     return m.type === req.flash.ERROR;
      //   });

      //   if (errors.length) {
      //     // TODO
      //   }
      // }


      req.session.version = version;

      // TODO make this support multiple messages...one day
      if (matches.length) {
        var match = matches[0];
        // we only bump their version
        if (!match.feature || features(match.feature, req)) {
          req.flash(match.type || req.flash.NOTIFICATION, match.message);
        }
      }

      next();
    };
  },
  decompressBody: function (req, res, next) {
    if (req.body && req.body.compressed) {
      req.body.compressed.split(',').forEach(function (key) {
        req.body[key] = LZString.decompressFromUTF16(req.body[key]);
      });
    }
    next();
  },
  nofollow: function (opts) {
    var allowed = opts.allowed || [];
    return function (req, res, next) {
      if (allowed.indexOf(req.url) !== -1) {
        return next();
      }
      res.setHeader('X-Robots-Tag', 'nofollow');
      next();
    };
  },
  protectServiceWorker: function (opts) {
    var allowed = opts ? opts.allowed : [];
    return function (req, res, next) {
      if (req.headers['service-worker'] === 'script') {
        if (allowed.indexOf(req.url) === -1) {
          return next(403);
        }
      }
      next();
    };
  }
};

function pathIsSSL(route) {
  return (undefsafe(config, 'url.ssl.paths') || []).reduce(function (bool, path) {
    if (route.indexOf(path) === 0) {
      bool = true;
    }
    return bool;
  }, false);
}
