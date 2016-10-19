exports.command = function(selector, callback) {
        var preSel = toString(selector)

    this
      .waitForElementVisible('.javascript .CodeMirror')
      .execute(function (text,selector){
        return $('.javascript .CodeMirror')[0].CodeMirror.setValue(text);
      }, [selector]);


  return this; // allows the command to be chained.
};
