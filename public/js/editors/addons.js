(function () {
  'use strict';
  /*globals $, jsbin*/
  var addons = {
    closebrackets: {
      url: '/js/vendor/codemirror3/addon/edit/closebrackets.js',
      done: function (cm) {
        cm.setOption('autoCloseBrackets', true);
      }
    },
    highlight: {
      url: '/js/vendor/codemirror3/addon/search/match-highlighter.js',
      done: function (cm) {
        cm.setOption('highlightSelectionMatches', true);
      }
    },
    vim: {
      url: [
        '/js/vendor/codemirror3/addon/dialog/dialog.css',
        '/js/vendor/codemirror3/keymap/vim.js',
        '/js/vendor/codemirror3/addon/dialog/dialog.js',
        '/js/vendor/codemirror3/addon/search/searchcursor.js'
      ],
      done: function (cm) {
        cm.setOption('vimMode', true);
        cm.setOption('showCursorWhenSelecting', true);
      }
    },
    emacs: {
      url: [
        '/js/vendor/codemirror3/keymap/emacs.js',
        '/js/vendor/codemirror3/addon/edit/matchbrackets.js',
        '/js/vendor/codemirror3/addon/comment/comment.js',
        '/js/vendor/codemirror3/addon/dialog/dialog.js',
        '/js/vendor/codemirror3/addon/search/searchcursor.js',
        '/js/vendor/codemirror3/addon/search/search.js'
      ],
      done: function (cm) {
        cm.setOption('keyMap', 'emacs');
      }
    },
    matchtags: {
      url: [
        '/js/vendor/codemirror3/addon/fold/xml-fold.js',
        '/js/vendor/codemirror3/addon/edit/matchtags.js'
      ],
      done: function (cm) {
        cm.setOption('matchTags', { bothTags: true });
        cm.setOption('extraKeys', {'Ctrl-J': 'toMatchingTag' });
      }
    },
    trailingspace: {
      url: '/js/vendor/codemirror3/addon/edit/trailingspace.js',
      done: function (cm) {
        cm.setOption('showTrailingSpace', true);
      }
    },
    fold: {
      url: [
        '/js/vendor/codemirror3/addon/fold/foldgutter.css',
        '/js/vendor/codemirror3/addon/fold/foldcode.js',
        '/js/vendor/codemirror3/addon/fold/foldgutter.js',
        '/js/vendor/codemirror3/addon/fold/brace-fold.js',
        '/js/vendor/codemirror3/addon/fold/xml-fold.js',
        '/js/vendor/codemirror3/addon/fold/comment-fold.js'
      ],
      done: function (cm) {
        $body.addClass('code-fold');
        cm.setOption('extraKeys', {'Ctrl-Q': function (cm) {
          cm.foldCode(cm.getCursor());
        }});
        cm.setOption('foldGutter', true);
        cm.setOption('gutters', ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']);
      }
    }
  };

  // begin loading user addons

  /**
   * TODO convert to RSVP
   */

  var $body = $('body');

  function load(url) {
    if (url.indexOf('http') !== 0) {
      url = jsbin.static + url;
    }

    if (url.slice(-3) === '.js') {
      return $.ajax({
        url: url + '?' + jsbin.version, // manual cache busting
        dataType: 'script',
        cache: true
      });
    } else if (url.slice(-4) === '.css') {
      var d = $.Deferred();
      setTimeout(function () {
        $body.append('<link rel="stylesheet" href="' + url + '?' + jsbin.version + '">');
        d.resolve();
      }, 0);
      return d;
    }
  }

  Object.keys(jsbin.settings.addons || {}).forEach(function (key) {
    var addon = addons[key];
    if (addon && jsbin.settings.addons[key]) {
      if (typeof addon.url === 'string') {
        addon.url = [addon.url];
      }

      // dirty jQuery way of doing .done on an array of promises
      $.when.call($, addon.url.map(load)).done(function () {
        if (addon.done) {
          // WHHHHHYYYY?? because for some reason, CodeMirror hasn't attached
          // the option yet, so we wait for a tick, and then it's there.
          setTimeout(function () {
            jsbin.panels.allEditors(function (panel) {
              if (panel.editor) {
                addon.done(panel.editor);
              }
            });
          }, 0);
        }
      });
    }
  });

})();