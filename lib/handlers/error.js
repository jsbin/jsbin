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

    utils.bindAll(this, 'httpError', 'uncaughtError');
  },

  // Handles all types of HTTPError and ensures that the correct type of
  // response is returned depending on the type of content requested. So if
  // you're expecting JSON you should get JSON.
  httpError: function (err, req, res, next) {
    if (err instanceof errors.NotFound) {
      return (new BinHandler(this.sandbox)).notFound(req, res);
    } else if (err instanceof errors.HTTPError) {
      res.statusCode = err.status;

      if (req.accepts('html')) {
        res.contentType('html');
        res.send(err.toHTMLString());
      } else if (req.accepts('json')) {
        res.json(err);
      } else {
        res.contentType('txt');
        res.send(err.toString());
      }

      return;
    }
    next(err);
  },

  // Displays a friendly 500 page in production if requesting html otherwise
  // returns an appropriate format.
  uncaughtError: function (err, req, res, next) {
    if (req.accepts('html')) {
      res.status(500).render('500.html', {dave: this.helpers.url('/images/logo.png', true, true)});
    } else {
      var error = new errors.HTTPError(500, 'Internal Server Error');
      this.httpError(error, req, res, next);
    }
  }
});
