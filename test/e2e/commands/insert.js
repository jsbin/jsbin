exports.command = function(selector, callback) {
  this.execute(function (text){
        return $(selector)[0].CodeMirror.setValue(text);
      }, ["body{background:rgba(0, 0, 0, 1)"]);


  return this; // allows the command to be chained.
};
