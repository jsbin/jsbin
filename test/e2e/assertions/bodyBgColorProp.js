var util = require('util');
exports.assertion = function(expected,client, msg) {
  var data = client.globals;

  var MSG_ELEMENT_NOT_FOUND = 'Testing if element body has css property backgroundColor: %s ' +
    'Element could not be located or backgroundColor does not match the verification  %s';

  this.message = msg || util.format('Testing if body has css property backgroundColor: %s', expected);
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
  client
      .goFrame();
    return this.api.getCssProperty('body', 'backgroundColor', callback);
  };

};
