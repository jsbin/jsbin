var utils = require('../utils'),
    errors = require('../errors'),
    BinHandler = require('./bin'),
    Observable = utils.Observable;

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

    if (err instanceof errors.NotFound) {
      return (new BinHandler(this.sandbox)).notFound(req, res);
    } else if (err instanceof errors.HTTPError) {
      res.statusCode = err.status;

      if (req.accepts(['html'])) {
        res.contentType('html');
        res.send(err.toHTMLString());
      } else if (req.accepts(['json'])) {
        res.json(err);
      } else {
        res.contentType('txt');
        res.send(err.toString());
      }

      return;
    }
    next(err);
  },

  // Fall through handler for when no routes match.
  notFound: function (req, res, next) {
    if (req.accepts('html')) {
      res.status(404).render('error', {
        is_404: true,
        root: this.helpers.url(),
        dave: this.helpers.url('/images/logo.png', false, true)
      });
    } else {
      var error = new errors.NotFound('Page Does Not Exist');
      this.httpError(error, req, res, next);
    }
  },

  // Displays a friendly 500 page in production if requesting html otherwise
  // returns an appropriate format.
  uncaughtError: function (err, req, res, next) {
    this.sendErrorReport(err, req);

    if (req.accepts('html')) {
      res.status(500).render('error', {
        is_500: true,
        dave: this.helpers.url('/images/logo.png', false, true)
      });
    } else {
      var error = new errors.HTTPError(500, 'Internal Server Error');
      this.httpError(error, req, res, next);
    }
  },

  sendErrorReport: function (err, req) {
    var to = this.helpers.set('notify errors'),
        session = utils.extend({}, req.session),
        context;

    if (this.helpers.production && to && to.length) {
      // Don't send the users email address via email.
      if (session && session.user) {
        delete session.user.email;
      }

      context = {
        name: err.name,
        message: err.message,
        stack: err.stack,
        body: JSON.stringify(req.body, null, 2),
        session: JSON.stringify(session, null, 2) || null,
        url: this.helpers.url(req.url, true)
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
    if (!(err instanceof errors.HTTPError) && err.status) {
      return errors.create(err.status, err.message);
    }
    return err;
  }
});
