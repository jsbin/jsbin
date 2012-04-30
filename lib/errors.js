// Create a not found error object. This should at some point inherit
// from a HTTPError object with a nice .toJSON() method that can be
// used directly by handlers.
function NotFound() {
  Error.apply(this, arguments);
}
NotFound.prototype = Object.create(Error.prototype);

module.exports.NotFound = NotFound;
