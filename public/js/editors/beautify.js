(function () {
  "use strict";
  /*globals $, jsbin, js_beautify, html_beautify, css_beautify*/

  if (jsbin.embed) {
    return;
  }

  function initBeautify(editor) {
    var keyMap = {
      'Ctrl-Shift-L': function () {
        console.log(test);
        beautify(jsbin.panels.focused);
      }
    };
    editor.addKeyMap(keyMap);
  }

  function beautify(focused_panel) {

    console.log('focused_panel', focused_panel);

    var beautifier,
      options = {};

    if (jsbin.state.processors[focused_panel.id] === 'html') {
      beautifier = html_beautify;
    }
    if (jsbin.state.processors[focused_panel.id] === 'css') {
      beautifier = css_beautify;
    }
    if (jsbin.state.processors[focused_panel.id] === 'javascript') {
      beautifier = js_beautify;
    }

    console.log('state', jsbin.state.processors[focused_panel.id]);
    console.log('beautifier', beautifier);

    if (beautifier) {
      focused_panel.editor.setCode(
        beautifier(
          focused_panel.editor.getCode()
        )
      );
    }

  }

  initBeautify(jsbin.panels.panels.html.editor);
  initBeautify(jsbin.panels.panels.css.editor);
  initBeautify(jsbin.panels.panels.javascript.editor);
})();
