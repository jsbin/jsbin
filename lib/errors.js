// Create a not found error object. This should at some point inherit
// from a HTTPError object with a nice .toJSON() method that can be
// used directly by handlers.
function HTTPError(status, message) {
  Error.call(this, message);

  // Remove the Error itself from the stack trace.
  // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
  Error.captureStackTrace(this, this.constructor);

  this.name    = this.constructor.name;
  this.status  = status;
  this.message = message || '';
}
HTTPError.prototype = Object.create(Error.prototype);
HTTPError.prototype = Object.create(HTTPError.prototype);

function NotFound(message) {
  Error.call(this, 404, message);
}
NotFound.prototype = Object.create(HTTPError.prototype);

module.exports.NotFound = NotFound;

function BadRequest(message) {
  HTTPError.call(this, 400, message);
}
BadRequest.prototype = Object.create(HTTPError.prototype);

module.exports.BadRequest = BadRequest;
