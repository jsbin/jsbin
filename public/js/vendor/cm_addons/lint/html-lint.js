// Depends on htmlhint.js from https://github.com/yaniswang/HTMLHint

// declare global: HTMLHint

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  CodeMirror.registerHelper("lint", "htmlmixed", function(text, options) {
    var found = [];
    if (!window.HTMLHint) return found;
    var results = HTMLHint.verify(text, options), messages = results, message = null;
    for ( var i = 0; i < messages.length; i++) {
      message = messages[i];
      var startLine = message.line -1, endLine = message.line -1, startCol = message.col -1, endCol = message.col;
      found.push({
        from: CodeMirror.Pos(startLine, startCol),
        to: CodeMirror.Pos(endLine, endCol),
        message: message.message,
        severity : message.type
      });
    }
    return found;
  });

});
