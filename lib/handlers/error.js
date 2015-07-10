'use strict';
var utils = require('../utils'),
    errors = require('../errors'),
    BinHandler = require('./bin'),
    parse = require('url').parse,
    Observable = utils.Observable,
    crypto = require('crypto');

// Handles application errors.
module.exports = Observable.extend({
  constructor: function ErrorHandler(sandbox) {
    Observable.apply(this, arguments);

    this.sandbox = sandbox;
    this.helpers = sandbox.helpers;
    this.mailer = sandbox.mailer;

    utils.bindAll(this, 'notFound', 'httpError', 'uncaughtError');
  },

  // Handles all types of HTTPError and ensures that the correct type of
  // response is returned depending on the type of content requested. So if
  // you're expecting JSON you should get JSON.
  httpError: function (err, req, res, next) {
    err = this.coerceError(err);

    if (err instanceof errors.NotFound && req.accepts('html')) {
      if (err instanceof errors.BinNotFound) {
        if (req.editor) {
          return (new BinHandler(this.sandbox)).notFound(req, res, next);
        }
      }

      return this.renderErrorPage('error', err, req, res);
    } else if (err instanceof errors.HTTPError) {
      // return this.renderError(err, req, res);
      return this.renderErrorPage(err.status, err, req, res);
    }

    if (err) {
      console.error(err.stack);
    }

    next(err);
  },

  // Fall through handler for when no routes match.
  notFound: function (req, res) {
    var error = new errors.NotFound('Page Does Not Exist');
    if (req.accepts('html') && (req.url.indexOf('/api/') !== 0)) {
      this.renderErrorPage('404', error, req, res);
    } else {
      this.renderError(error, req, res);
    }
  },

  // Displays a friendly 500 page in production if requesting html otherwise
  // returns an appropriate format.
  uncaughtError: function (err, req, res) {
    console.error('uncaughtError', req.method + ' ' + req.url);
    this.sendErrorReport(err, req);

    if (req.accepts('html')) {
      this.renderErrorPage('error', err, req, res);
    } else {
      var error = new errors.HTTPError(500, 'Internal Server Error');
      this.renderError(error, req, res);
    }
  },

  renderError: function (err, req, res) {
    res.status(err.status);

    if (req.accepts(['html']) && !req.isApi) {
      res.contentType('html');
      res.send(err.toHTMLString());
    } else if (req.accepts(['json']) || req.isApi || req.ajax) {
      res.json(err);
    } else {
      res.contentType('txt');
      res.send(err.toString());
    }
  },

  renderErrorPage: function (view, err, req, res) {
    var status = err.status || 500;

    var views = ['error', 504, 502, 410, 423];
    var url = parse(req.url);

    if (view === 423) {
      url.pathname = url.pathname.replace(/\/(watch|edit).*$/, '/');
      if (url.pathname.slice(-1) !== '/') {
        url.pathname += '/';
      }
    }

    if (req.isApi) {
      return res.status(status).send({
        error: status === 404 ? 'not found' : err.message
      });
    }

    res.status(status).render(views.indexOf(view) !== -1 ? view : 'error', {
      version: req.app.locals.version,
      is_500: status !== 404, // Saves us having many error pages at the mo.
      is_404: status === 404,
      root: this.helpers.url('', true),
      static: this.helpers.urlForStatic(null, req.secure),
      err: err,
      stack: err.stack ? err.stack : '',
      request: {
        url: url.pathname,
        method: req.method
      }
    });
  },

  sendErrorReport: function (err, req) {
    var to = this.helpers.set('notify errors'),
        session = utils.extend({}, req.session),
        context, headers;

    if (this.helpers.production && to && to.length) {
      // Don't send the users email address via email.
      if (session && session.user) {
        delete session.user.email;
      }

      headers = utils.extend({}, req.headers);
      delete headers.cookie;

      context = {
        name: err.name,
        message: err.message,
        hash: crypto.createHash('md5').update(err.stack).digest('hex').slice(0, 6),
        stack: err.stack,
        body: JSON.stringify(req.body, null, 2),
        session: JSON.stringify(session, null, 2) || null,
        url: this.helpers.url(req.url, true),
        path: req.url,
        headers: JSON.stringify(headers, null, 2) || null,
        method: req.method
      };

      if (context.body === '{}') {
        context.body = null;
      }

      this.mailer.errorReport(to, context);
    }
  },

  // Checks to see if the error has a status property and if so converts
  // it into an instance of HTTPError. Just returns this original error
  // if no status is found.
  coerceError: function (err) {
    var status = typeof err === 'number' ? err : err.status;

    if (!(err instanceof errors.HTTPError) && status) {
      return errors.create(status, err.message);
    }
    return err;
  }
});
