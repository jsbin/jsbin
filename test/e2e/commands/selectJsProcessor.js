exports.command = function(processorSelector, callback) {
    var processor = '#processor-' + processorSelector;
    this
      .waitForElementVisible('.javascript .CodeMirror')
      .click('a[href="#javascriptprocessors"]')
      .click(processor).pause(this.globals.defaultTimeout)
  return this;
};
