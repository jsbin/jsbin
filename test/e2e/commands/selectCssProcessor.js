exports.command = function(cssPreprocessor, callback) {
    var processor = '#processor-' + cssPreprocessor;
    this
      .waitForElementVisible('.css .CodeMirror')
      .click('a[href="#cssprocessors"]')
      .click(processor).pause(this.globals.defaultTimeout)

  return this;
};
