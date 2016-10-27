exports.command = function(text) {
    this
      .waitForElementVisible('.css .CodeMirror')
      .execute(function (text){
        return $('.css .CodeMirror')[0].CodeMirror.setValue(text);
      }, [text]);

  return this; // allows the command to be chained.
};
