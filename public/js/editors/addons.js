(function () {
  'use strict';
  /*globals $, jsbin, CodeMirror*/

  var defaults = {
    closebrackets: true,
    highlight: false,
    vim: false,
    emacs: false,
    trailingspace: false,
    fold: false,
    sublime: false,
    tern: false,
    activeline: true,
    matchbrackets: false,
    csslint: false
  };

  if (!jsbin.settings.addons) {
    jsbin.settings.addons = defaults;
  }

  var addons = {
    closebrackets: {
      url: '/js/vendor/codemirror4/addon/edit/closebrackets.js',
      test: defaultTest('autoCloseBrackets'),
      done: function (cm) {
        setOption(cm, 'autoCloseBrackets', true);
      }
    },
    highlight: {
      url: '/js/vendor/codemirror4/addon/search/match-highlighter.js',
      test: defaultTest('highlightSelectionMatches'),
      done: function (cm) {
        setOption(cm, 'highlightSelectionMatches', true);
      }
    },
    vim: {
      url: [
        '/js/vendor/codemirror4/addon/dialog/dialog.css',
        '/js/vendor/codemirror4/keymap/vim.js',
        '/js/vendor/codemirror4/addon/dialog/dialog.js'
      ],
      test: defaultTest('vimMode'),
      done: function (cm) {
        setOption(cm, 'vimMode', true);
        setOption(cm, 'showCursorWhenSelecting', true);
      }
    },
    emacs: {
      url: [
        '/js/vendor/codemirror4/addon/dialog/dialog.css',
        '/js/vendor/codemirror4/keymap/emacs.js',
        '/js/vendor/codemirror4/addon/dialog/dialog.js',
        '/js/vendor/codemirror4/addon/search/search.js'
      ],
      test: function () {
        return jsbin.panels.panels.javascript.editor.openDialog &&
               CodeMirror.commands.find &&
               CodeMirror.keyMap.emacs;
      },
      done: function (cm) {
        setOption(cm, 'keyMap', 'emacs');
      }
    },
    matchtags: {
      url: [
        '/js/vendor/codemirror4/addon/fold/xml-fold.js',
        '/js/vendor/codemirror4/addon/edit/matchtags.js'
      ],
      test: function () {
        return CodeMirror.scanForClosingTag &&
               CodeMirror.optionHandlers.matchTags;
      },
      done: function (cm) {
        setOption(cm, 'matchTags', { bothTags: true });
        cm.addKeyMap({'Ctrl-J': 'toMatchingTag' });
      }
    },
    trailingspace: {
      url: '/js/vendor/codemirror4/addon/edit/trailingspace.js',
      test: defaultTest('showTrailingSpace'),
      done: function (cm) {
        setOption(cm, 'showTrailingSpace', true);
      }
    },
    fold: {
      url: [
        '/js/vendor/codemirror4/addon/fold/foldgutter.css',
        '/js/vendor/codemirror4/addon/fold/foldcode.js',
        '/js/vendor/codemirror4/addon/fold/foldgutter.js',
        '/js/vendor/codemirror4/addon/fold/brace-fold.js',
        '/js/vendor/codemirror4/addon/fold/xml-fold.js',
        '/js/vendor/codemirror4/addon/fold/comment-fold.js'
      ],
      test: function () {
        return CodeMirror.helpers.fold &&
               CodeMirror.optionHandlers.foldGutter &&
               CodeMirror.optionHandlers.gutters;
      },
      done: function (cm) {
        $body.addClass('code-fold');
        cm.addKeyMap({'Ctrl-Q': function (cm) {
          cm.foldCode(cm.getCursor());
        }});
        setOption(cm, 'foldGutter', true);
        var gutters = cm.getOption('gutters');
        console.log('gutters', gutters);
        gutters.push('CodeMirror-linenumbers');
        gutters.push('CodeMirror-foldgutter');
        setOption(cm, 'gutters', gutters);
      }
    },
    sublime: {
      url: [
        '/js/vendor/codemirror4/addon/dialog/dialog.css',
        '/js/vendor/codemirror4/keymap/sublime.js',
        '/js/vendor/codemirror4/addon/dialog/dialog.js',
        '/js/vendor/codemirror4/addon/search/search.js'
      ],
      test: function () {
        return jsbin.panels.panels.javascript.editor.openDialog &&
               CodeMirror.commands.find &&
               CodeMirror.keyMap.sublime;
      },
      done: function (cm) {
        setOption(cm, 'keyMap', 'sublime');
        // Keys that CodeMirror should never take over
        var cmd = $.browser.platform === 'mac' ? 'Cmd' : 'Ctrl';
        delete CodeMirror.keyMap['sublime'][cmd + '-L'];
        delete CodeMirror.keyMap['sublime'][cmd + '-T'];
        delete CodeMirror.keyMap['sublime'][cmd + '-W'];
        delete CodeMirror.keyMap['sublime'][cmd + '-J'];
        delete CodeMirror.keyMap['sublime'][cmd + '-R'];
        delete CodeMirror.keyMap['sublime'][cmd + '-Enter'];
        delete CodeMirror.keyMap['sublime'][cmd + '-Up'];
        delete CodeMirror.keyMap['sublime'][cmd + '-Down'];
        cm.removeKeyMap('noEmmet');
      }
    },
    tern: {
      url: [
        '/js/vendor/codemirror4/addon/dialog/dialog.css',
        '/js/vendor/codemirror4/addon/hint/show-hint.css',
        '/js/vendor/codemirror4/addon/tern/tern.css',
        '/js/vendor/codemirror4/addon/hint/show-hint.js',
        '/js/vendor/codemirror4/addon/dialog/dialog.js',
        '/js/prod/addon-tern-' + jsbin.version + '.min.js'
      ],
      test: function () {
        return jsbin.panels.panels.javascript.editor.openDialog &&
               (typeof window.ternBasicDefs !== undefined) &&
               CodeMirror.showHint &&
               CodeMirror.TernServer &&
               CodeMirror.startTern;
      },
      done: function () {
        CodeMirror.startTern();
      }
    },
    activeline: {
      url: [
        '/js/vendor/codemirror4/addon/selection/active-line.js'
      ],
      test: function() {
        return CodeMirror.defaults.styleActiveLine !== undefined;
      },
      done: function(cm) {
        setOption(cm, 'styleActiveLine', true);
      }
    },
    matchbrackets: {
      url: [],
      test: function() {
        return CodeMirror.defaults.matchBrackets !== undefined;
      },
      done: function(cm) {
        setOption(cm, 'matchBrackets', true);
      }
    },
    csslint: {
      url: [
        '/js/vendor/cm_addons/lint/lint.css',
        '/js/vendor/cm_addons/lint/csslint.js',
        '/js/vendor/cm_addons/lint/css-lint.js',
        '/js/vendor/cm_addons/lint/lint.js'
      ],
      test: function() {
        return CodeMirror.defaults.lint !== undefined &&
               CodeMirror.helpers.lint &&
               CodeMirror.helpers.lint.css &&
               CodeMirror.optionHandlers.lint;
      },
      done: function(cm) {
        if (cm.getOption('mode') === 'css') {
          setOption(cm, 'lintOpt', {
            console: true,
            consoleParent: cm.getWrapperElement().parentNode.parentNode,
            line: true,
            under: false,
            tooltip: true
            // gutter option doesn't exist, it takes from main gutters property
          });
          var gutters = cm.getOption('gutters');
          gutters.push('CodeMirror-lint-markers');
          setOption(cm, 'gutters', gutters);
          setOption(cm, 'lint', true);
          var ln = cm.getOption('lineNumbers');
          setOption(cm, 'lineNumbers', !ln);
          setOption(cm, 'lineNumbers', ln);
        }
      }
    }
  };

  // begin loading user addons


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

  function ready(test) {
    var d = $.Deferred();
    var timer = null;

    if (test()) {
      d.resolve();
    } else {
      timer = setInterval(function () {
        if (test()) {
          clearInterval(timer);
          d.resolve();
        }
      }, 100);
    }

    return d;
  }

  function setOption(cm, option, value) {
    cm.setOption(option, value);
  }

  function defaultTest(prop) {
    return function () {
      return CodeMirror.optionHandlers[prop] !== undefined;
    };
  }

  var options = Object.keys(jsbin.settings.addons);

  function loadAddon(key) {
    var addon = addons[key];
    if (addon && jsbin.settings.addons[key]) {
      if (typeof addon.url === 'string') {
        addon.url = [addon.url];
      }

      // dirty jQuery way of doing .done on an array of promises
      $.when.call($, addon.url.map(load)).done(function () {
        if (addon.done) {
          ready(addon.test).then(function () {
            jsbin.panels.allEditors(function (panel) {
              if (panel.editor) {
                addon.done(panel.editor);
              }
            });
          });
        }
      });
    }
  }

  options.forEach(loadAddon);

  // External method to realod all the addons
  window.reloadAddons = function(arr) {
    if (arr) {
      arr.forEach(loadAddon);
    } else {
      options.forEach(loadAddon);
    }
  };

})();