exports.command = function(selector, callback) {
    var data = this.globals;
    this
      .waitForElementVisible('#panel-javascript')
      .click(selector)
  return this; // allows the command to be chained.
};
