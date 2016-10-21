exports.command = function(value, callback) {
    this
      .waitForElementVisible('.javascript .CodeMirror')
      .execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, [value]);

  return this; // allows the command to be chained.
};
