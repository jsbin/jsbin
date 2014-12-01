(function () {
  'use strict';
  /*globals $, jsbin */

  if (jsbin.embed) {
    return;
  }

  function beautify() {

    var focusedPanel = jsbin.panels.focused,
      beautifyUrls = {
        html: jsbin['static'] + '/js/vendor/beautify/beautify-html.js',
        css: jsbin['static'] + '/js/vendor/beautify/beautify-css.js',
        js: jsbin['static'] + '/js/vendor/beautify/beautify.js'
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
    $.getScript(url).done(callback);
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

  $(document).on('keydown', function beautifyKeyBinding(e) {
    if (e.ctrlKey && e.shiftKey && e.which == 76) {
      // ctrl/command + shift + L
      beautify();
    }
  });

})();
