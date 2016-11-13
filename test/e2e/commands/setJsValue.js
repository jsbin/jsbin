exports.command = function(text) {
    this
      .waitForElementVisible('.javascript .CodeMirror')
      .execute(function (text){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, [text]);

  return this;
};
