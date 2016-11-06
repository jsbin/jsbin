exports.command = function(text) {
    this
      .waitForElementVisible('.html .CodeMirror')
      .execute(function (text){
      return $('.html .CodeMirror')[0].CodeMirror.setValue(text);
      }, [text]);

  return this; // allows the command to be chained.
};
