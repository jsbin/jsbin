var utils = require('./utils');

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
  helpers: function (app) {
    return function (req, res, next) {
      req.store   = app.store;
      req.models  = app.models;

      req.helpers = {
        set: app.set.bind(app),
        render: app.render.bind(app),
        analytics: function (fn) {
          app.render('analytics', {id: req.helpers.set('analytics id')}, fn);
        },
        url: function (path, full) {
          return app.set(full ? 'url full' : 'url prefix') + path;
        },
        urlForBin: function (bin, full) {
          return req.helpers.url(bin.url + '/' + bin.revision, full);
        },
        editUrlForBin: function (bin, full) {
          return req.helpers.urlForBin(bin, full) + '/edit';
        }
      };

      Object.defineProperties(req.helpers, {
        production: {
          get: function () {
            return app.set('env') === app.PRODUCTION;
          }
        }
      });

      next();
    };
  }
};
