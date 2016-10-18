exports.command = function(selector, callback) {
    var data = this.globals;
    this
      .waitForElementVisible('.css .CodeMirror')
      .click('a[href="#cssprocessors"]')
      .click(selector).pause(data.defaultTime)
  return this; // allows the command to be chained.
};
