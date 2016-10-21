exports.command = function(selector, callback) {
    var data = this.globals;
    var processor = '#processor-' + selector;
    this
      .waitForElementVisible('.css .CodeMirror')
      .click('a[href="#cssprocessors"]')
      .click(processor).pause(data.defaultTimeout)
  return this; // allows the command to be chained.
};
