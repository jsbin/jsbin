exports.command = function(selector, callback) {
    var data = this.globals;
    var processor = '#processor-' + selector;
    this
      .waitForElementVisible('.javascript .CodeMirror')
      .click('a[href="#javascriptprocessors"]')
      .click(processor).pause(data.defaultTimeout)
  return this; // allows the command to be chained.
};
