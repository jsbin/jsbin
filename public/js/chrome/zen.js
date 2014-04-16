var zen = (function () {
  'use strict';
  /*global CodeMirror, jsbin*/
  var cm = jsbin.panels.panels.html.editor;

  var widget = document.createElement('span');
  var text = document.createTextNode('<-- snip -->');
  widget.style.color = '#ccc';
  widget.appendChild(text);

  var a = CodeMirror.Pos(0, 0);
  var b = null; // TODO find <body> line
  var x, y;

  var start = null;
  var end = null;

  function updatePositions() {
    var cursor = cm.getSearchCursor(/<body/i);
    cursor.findNext();
    b = cursor.pos.from;
    b.ch = cursor.pos.match.input.length;
    cursor = cm.getSearchCursor(/<\/body>/i);
    cursor.findNext();
    x = cursor.pos.from;
    y = CodeMirror.Pos(cm.doc.lineCount() - 1);
  }

  function snip() {
    updatePositions();

    var startWidget = widget.cloneNode(true);
    startWidget.title = cm.getRange(a, b);

    var endWidget = widget.cloneNode(true);
    endWidget.title = cm.getRange(x, y);
    start = cm.markText(a, b, {replacedWith: startWidget });
    end = cm.markText(x, y, {replacedWith: endWidget });
  }

  function clear() {
    start.clear();
    end.clear();
  }

  return {
    snip: snip,
    clear: clear
  };

})();