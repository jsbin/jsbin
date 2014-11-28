(function () {
  'use strict';
  /*globals $, jsbin, js_beautify, html_beautify, css_beautify*/

  if (jsbin.embed) {
    return;
  }

  function initBeautify(editor) {
    var keyMap = {
      'Ctrl-Shift-L': function () {
        beautify();
      }
    };
    editor.addKeyMap(keyMap);
  }

  function beautify() {

    var focusedPanel = jsbin.panels.focused,
      beautifyUrls = {
        html: '/js/vendor/beautify/beautify-html.js',
        css: '/js/vendor/beautify/beautify-css.js',
        js: '/js/vendor/beautify/beautify.js'
      };

    if (jsbin.state.processors[focusedPanel.id] === 'html') {
      if (!window.html_beautify) {
        lazyLoadAndRun(beautifyUrls.html, beautifyHTML);
      } else {
        beautifyHTML();
      }
    } else if (jsbin.state.processors[focusedPanel.id] === 'css') {
      if (!window.css_beautify) {
        lazyLoadAndRun(beautifyUrls.css, beautifyCSS);
      } else {
        beautifyCSS();
      }
    } else if (jsbin.state.processors[focusedPanel.id] === 'javascript') {
      if (!window.js_beautify) {
        lazyLoadAndRun(beautifyUrls.js, beautifyJS);
      } else {
        beautifyJS();
      }
    }

  }

  function lazyLoadAndRun(url, callback) {
    $.getScript(url).done(function () {
      callback();
    });
  }

  function beautifyHTML() {
    runBeautifier(jsbin.panels.focused, window.html_beautify);
  }

  function beautifyCSS() {
    runBeautifier(jsbin.panels.focused, window.css_beautify);
  }

  function beautifyJS() {
    runBeautifier(jsbin.panels.focused, window.js_beautify);
  }

  function runBeautifier(panel, beautifier) {
    panel.editor.setCode(
      beautifier(
        panel.editor.getCode()
      )
    );
  }

  window.testBeautify = function () {
    beautify();
  };

  initBeautify(jsbin.panels.panels.html.editor);
  initBeautify(jsbin.panels.panels.css.editor);
  initBeautify(jsbin.panels.panels.javascript.editor);
})();
