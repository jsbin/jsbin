var inherit = require('./utils').inherit;

// Creates a generic HTTP error object. Accepts a HTTP status and an error
// message.
//
// Example:
//
//    next(new HTTPError(500, 'Something went horribly wrong'));
var HTTPError = exports.HTTPError = inherit(Error, {
  constructor: function HTTPError(status, message) {
    Error.call(this, message);

    // Remove the Error itself from the stack trace.
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    Error.captureStackTrace(this, this.constructor);

    this.name    = this.constructor.name;
    this.status  = status;
    this.message = message || '';
  },

  // Renders the error in string format suitable for use in a HTTP response.
  toString: function () {
    return this.status + this.name.replace(/([A-Z]+)/g, ' $1') + ':\n\n' + this.message;
  },

  // Renders the error in html format suitable for use in an HTTP response.
  toHTMLString: function () {
    return [
      '<h1>' +  this.status + this.name.replace(/([A-Z])/g, ' $1') + '</h1>',
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

exports.MailerError = HTTPError.extend({
  constructor: function MailerError(message) {
    HTTPError.call(this, 500, message);
  }
});
