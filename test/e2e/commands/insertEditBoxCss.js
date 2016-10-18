exports.command = function(selector, callback) {
        var preSel = toString(selector)

    this
      .execute(function (text,selector){
        return $(selector)[0].CodeMirror.setValue(text);
      }, ["body{background-color:#000}",selector]);


  return this; // allows the command to be chained.
};
