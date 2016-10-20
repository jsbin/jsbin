exports.command = function(selector, callback) {
    this
      .waitForElementVisible('.css .CodeMirror')
      .execute(function (text,selector){
        return $('.css .CodeMirror')[0].CodeMirror.setValue(text);
      }, [selector]);


  return this; // allows the command to be chained.
};
