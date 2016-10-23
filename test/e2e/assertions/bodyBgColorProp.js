/**
 * Checks if the specified css property of a given element has the expected value.
 *
 * ```
 *    this.demoTest = function (client) {
 *      browser.assert.cssProperty('#main', 'display', 'block');
 *    };
 * ```
 *
 * @method cssProperty
 * @param {string} selector The selector (CSS / Xpath) used to locate the element.
 * @param {string} cssProperty The CSS property.
 * @param {string} expected The expected value of the css property to check.
 * @param {string} [message] Optional log message to display in the output. If missing, one is displayed by default.
 * @api assertions
 */

var util = require('util');
exports.assertion = function(expected,client, msg) {

  var MSG_ELEMENT_NOT_FOUND = 'Testing if element <%s> has css property %s. ' +
    'Element or attribute could not be located.';

  this.message = msg || util.format('Testing if element <%s> has css property "%s: %s".', 'body', 'backgroundColor', expected);
  this.expected = expected;

  this.pass = function(value) {
    return value === expected;
  };

  this.failure = function(result) {
    var failed = result === false || result && result.status === -1;
    if (failed) {
      this.message = msg || util.format(MSG_ELEMENT_NOT_FOUND, 'body', 'backgroundColor');
    }
    return failed;
  };

  this.value = function(result) {
    return result.value;
  };

  this.command = function(callback) {
  client  .frame(1)
        .pause(1000)
        .frame(0)

    return this.api.getCssProperty('body', 'backgroundColor', callback);
  };

};
