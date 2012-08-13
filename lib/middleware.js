var utils   = require('./utils'),
    helpers = require('./helpers'),
    custom  = require('./custom'),
    connect = require('express/node_modules/connect');

// Custom middleware used by the application.
module.exports = {
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
  // Check for ajax requests and set the Request/Response#ajax flag to true. 
  ajax: function () {
    return function (req, res, next) {
      req.ajax = res.ajax = utils.isAjax(req);
      next();
    };
  },
  // Add relevant CORS headers for the application.
  cors: function () {
    return function (req, res, next) {
      if (req.method === 'OPTIONS' || (req.method === 'GET' && utils.isAjax(req))) {
        res.header({
          'Access-Control-Allow-Origin':  '*',
          'Access-Control-Allow-Headers': 'X-Requested-With'
        });
      }

      next();
    };
  },
  flash: function () {
    function flash(key, message) {
      var cache = this.session.flash = this.session.flash || {},
          value;

      if (arguments.length === 2) {
        cache[key] = message;
        return this;
      } else if (arguments.length === 1) {
        value = cache[key];
        delete cache[key];
        return value;
      }

      this.session.flash = {};
      return cache;
    }

    return function (req, res, next) {
      req.flash = res.flash = flash.bind(req);

      req.flash.INFO = 'info';
      req.flash.ERROR = 'error';

      next();
    };
  },
  // Redirect urls with trailing slashes to their non-trailing counterpart,
  // requires the "strict routing" setting to be false.
  noslashes: function () {
    return function (req, res, next) {
      if (req.path !== '/' && req.originalUrl.slice(-1) === '/') {
        return res.redirect(301, req.originalUrl.slice(0, -1));
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
      if (always[req.method] || ignore.indexOf(req.url) === -1) {
        return csrf(req, res, next);
      } else {
        next();
      }
    };
  },
  // Checks for a subdomain in the current url, if found updates the app config
  // to include it. This supports existing behaviour that allows subdomains
  // to load custom config files.
  subdomain: function (app) {
    return function (req, res, next) {
      // THIS CODE IS SERIOUSLY FUCKED! IT CHANGES THE URL.HOST ON THE
      // FLY FOR ALL REQUESTS - NOT COOL!
      // var host  = req.header('Host', ''),
      //     parts = host.split('.'),
      //     url;
      // 
      // if (parts.length > 2) {
      //   url = app.set('url full').replace(app.set('url host'), host);
      //   app.set('url host', host);
      //   app.set('url full', url);
      //   req.subdomain = parts.slice(0, -2).join('.');
      // }
      next();
    };
  }
};
