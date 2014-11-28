(function () {
  'use strict';
  /*globals $, jsbin, js_beautify, html_beautify, css_beautify*/

  if (jsbin.embed) {
    return;
  }

  function initBeautify(editor) {
    var keyMap = {
      'Ctrl-Shift-L': function () {
        beautify(jsbin.panels.focused);
      }
    };
    editor.addKeyMap(keyMap);
  }

  function beautify(focusedPanel) {

    if (jsbin.state.processors[focusedPanel.id] === 'html') {
      if (!window.html_beautify) {
        $.getScript('/js/vendor/beautify/beautify-html.js').done(function runHtmlBeautify() {
          runBeautifier(focusedPanel, window.html_beautify);
        });
      } else {
        runBeautifier(focusedPanel, window.html_beautify);
      }
    } else if (jsbin.state.processors[focusedPanel.id] === 'css') {
      if (!window.css_beautify) {
        $.getScript('/js/vendor/beautify/beautify-css.js').done(function runCssBeautify() {
          runBeautifier(focusedPanel, window.css_beautify);
        });
      } else {
        runBeautifier(focusedPanel, window.css_beautify);
      }
    } else if (jsbin.state.processors[focusedPanel.id] === 'javascript') {
      if (!window.js_beautify) {
        $.getScript('/js/vendor/beautify/beautify.js').done(function runJsBeautify() {
          runBeautifier(focusedPanel, window.js_beautify);
        });
      } else {
        runBeautifier(focusedPanel, window.js_beautify);
      }
    }

  }

  function runBeautifier(panel, beautifier) {
    panel.editor.setCode(
      beautifier(
        panel.editor.getCode()
      )
    );
  }

  window.testBeautify = function () {
    beautify(jsbin.panels.focused);
  };

  initBeautify(jsbin.panels.panels.html.editor);
  initBeautify(jsbin.panels.panels.css.editor);
  initBeautify(jsbin.panels.panels.javascript.editor);
})();
