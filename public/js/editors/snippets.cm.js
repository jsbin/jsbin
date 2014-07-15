/*global jsbin:true, CodeMirror:true */
(function() {
  'use strict';
  var defaults = {
      cl: 'console.log(\'$0\');',
      fn: 'function $0() {\n\t\n}'
    };

  CodeMirror.snippets = function(cm) {
    var pos = cm.getCursor(),
        tok = cm.getTokenAt(pos),
        targetCursorPos = -1,
        macro = '',
        tagName = tok.string,
        snippets = jsbin.settings.snippets || defaults;

    if (tok.end > pos.ch) {
      tagName = tagName.slice(0, tagName.length - tok.end + pos.ch);
    }
    var key = tagName.toLowerCase();

    if (snippets[key]) {
      targetCursorPos = snippets[key].indexOf('$0');
      macro = snippets[key].replace(/\$0/, '');
      cm.replaceRange(macro,{line: pos.line, ch: pos.ch - key.length}, {line: pos.line, ch: pos.ch + key.length});

      if (targetCursorPos !== -1) {
        cm.setCursor({ line: pos.line, ch: pos.ch - key.length + targetCursorPos });
      }
      return;
    }
    return CodeMirror.Pass;
  };
})();