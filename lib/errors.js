var inherit = require('./utils').inherit;
var metrics = require('./metrics');


// Creates a generic HTTP error object. Accepts a HTTP status and an error
// message.
//
// Example:
//
//    next(new HTTPError(500, 'Something went horribly wrong'));
var HTTPError = exports.HTTPError = inherit(Error, {
  constructor: function HTTPError(status, message) {
    Error.call(this, message);

    metrics.increment('error.' + status);

    // Remove the Error itself from the stack trace.
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    Error.captureStackTrace(this, this.constructor);

    this.name    = this.constructor.name;
    this.status  = status;
    this.message = message || '';
  },

  // Renders the error in string format suitable for use in a HTTP response.
  toString: function () {
    return this.status + ' ' + this.name + ':\n\n' + this.message;
  },

  // Renders the error in html format suitable for use in an HTTP response.
  toHTMLString: function () {
    return [
      '<h1>' +  this.status + ' ' + this.name + '</h1>',
      '<p>' + this.message + '</p>'
    ].join('\n');
  }
}, {

  // Provides a clean method for creating a new extension (sub class) of this
  // object.
  //
  // Example:
  //
  //   var NotFound = HTTPError.extend({});
  extend: inherit.constructor().extend
});

// Creates an error object for handling 404 responses.
exports.NotFound = HTTPError.extend({
  constructor: function NotFound(message) {
    HTTPError.call(this, 404, message);
  }
});

exports.BinNotFound = exports.NotFound.extend({
  constructor: function BinNotFound(message) {
    exports.NotFound.call(this, 404, message);
  }
});

// Creates an error object for handling 401 responses.
exports.Forbidden = HTTPError.extend({
  constructor: function Forbidden(message) {
    HTTPError.call(this, 403, message);
  }
});

// Creates an error object for handling 401 responses.
exports.NotAuthorized = HTTPError.extend({
  constructor: function NotAuthorized(message) {
    HTTPError.call(this, 401, message);
  }
});

// Creates an error object for handling 400 responses.
exports.BadRequest = HTTPError.extend({
  constructor: function BadRequest(message) {
    HTTPError.call(this, 400, message);
  }
});

exports.RequestEntityTooLarge = HTTPError.extend({
  constructor: function RequestEntityTooLarge(message) {
    HTTPError.call(this, 413, message);
  }
});

exports.MailerError = HTTPError.extend({
  constructor: function MailerError(message) {
    HTTPError.call(this, 500, message);
  }
});

// Creates a new error object based on the status code.
exports.create = function (status, message) {
  switch (status) {
  case 400:
    return new exports.BadRequest(message);
  case 401:
    return new exports.NotAuthorized(message);
  case 403:
    return new exports.Forbidden(message);
  case 404:
    return new exports.NotFound(message);
  default:
    return new exports.HTTPError(status, message);
  }
};
