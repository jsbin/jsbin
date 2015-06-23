(function () {
  'use strict';
  /*globals $, jsbin, CodeMirror*/

  // ignore addons for embedded views
  if (jsbin.embed) {
    return;
  }

  var processors = jsbin.state.processors;

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
    matchbrackets: false
  };

  if (!jsbin.settings.addons) {
    jsbin.settings.addons = defaults;
  }

  var detailsSupport = 'open' in document.createElement('details');

  var settingsHints = {};
  var settingsHintShow = {};
  var hintShow = {
    console: true,
    line: false,
    under: false,
    gutter: false
  };
  // css must go last for the moment due to CSSLint creating the
  // global variable 'exports'
  ['js', 'html', 'coffeescript', 'css'].forEach(function (val) {
    var h = val + 'hint';
    var d = false;
    if (val === 'js') {
      d = true;
    }
    settingsHints[h] = (jsbin.settings[h] !== undefined) ? jsbin.settings[h] : d;
  });

  settingsHintShow = $.extend({}, hintShow, jsbin.settings.hintShow);
  settingsHintShow.tooltip = settingsHintShow.gutter;
  var settingsAddons = $.extend({}, jsbin.settings.addons, settingsHints);

  var addons = {
    closebrackets: {
      url: '/js/vendor/codemirror5/addon/edit/closebrackets.js',
      test: defaultTest('autoCloseBrackets'),
      done: function (cm) {
        setOption(cm, 'autoCloseBrackets', true);
      }
    },
    highlight: {
      url: '/js/vendor/codemirror5/addon/search/match-highlighter.js',
      test: defaultTest('highlightSelectionMatches'),
      done: function (cm) {
        setOption(cm, 'highlightSelectionMatches', true);
      }
    },
    vim: {
      url: [
        '/js/vendor/codemirror5/keymap/vim.js'
      ],
      test: defaultTest('vimMode'),
      done: function (cm) {
        setOption(cm, 'vimMode', true);
        setOption(cm, 'showCursorWhenSelecting', true);
      }
    },
    emacs: {
      url: [
        '/js/vendor/codemirror5/keymap/emacs.js'
      ],
      test: function () {
        return CodeMirror.keyMap.emacs;
      },
      done: function (cm) {
        setOption(cm, 'keyMap', 'emacs');
      }
    },
    matchtags: {
      url: [
        '/js/vendor/codemirror5/addon/fold/xml-fold.js',
        '/js/vendor/codemirror5/addon/edit/matchtags.js'
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
      url: '/js/vendor/codemirror5/addon/edit/trailingspace.js',
      test: defaultTest('showTrailingSpace'),
      done: function (cm) {
        setOption(cm, 'showTrailingSpace', true);
      }
    },
    fold: {
      url: [
        '/js/vendor/codemirror5/addon/fold/foldgutter.css',
        '/js/vendor/codemirror5/addon/fold/foldcode.js',
        '/js/vendor/codemirror5/addon/fold/foldgutter.js',
        '/js/vendor/codemirror5/addon/fold/brace-fold.js',
        '/js/vendor/codemirror5/addon/fold/xml-fold.js',
        '/js/vendor/codemirror5/addon/fold/comment-fold.js'
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
        var copyGutters = gutters.slice();
        copyGutters.push('CodeMirror-foldgutter');
        setOption(cm, 'gutters', copyGutters);
      }
    },
    sublime: {
      url: [
        '/js/vendor/codemirror5/keymap/sublime.js'
      ],
      test: function () {
        return CodeMirror.keyMap.sublime;
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
        CodeMirror.keyMap['sublime']['Shift-Tab'] = 'indentAuto';
        cm.removeKeyMap('noEmmet');
      }
    },
    tern: {
      url: [
        '/js/vendor/codemirror5/addon/hint/show-hint.css',
        '/js/vendor/codemirror5/addon/tern/tern.css',
        '/js/vendor/codemirror5/addon/hint/show-hint.js',
        '/js/prod/addon-tern-' + jsbin.version + '.min.js'
      ],
      test: function () {
        return (typeof window.ternBasicDefs !== 'undefined') &&
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
        '/js/vendor/codemirror5/addon/selection/active-line.js'
      ],
      test: function() {
        return (typeof CodeMirror.defaults.styleActiveLine !== 'undefined');
      },
      done: function(cm) {
        setOption(cm, 'styleActiveLine', true);
      }
    },
    matchbrackets: {
      url: [],
      test: function() {
        return (typeof CodeMirror.defaults.matchBrackets !== 'undefined');
      },
      done: function(cm) {
        setOption(cm, 'matchBrackets', true);
      }
    },
    csshint: {
      url: [
        '/js/vendor/csslint/csslint.min.js',
        '/js/vendor/cm_addons/lint/css-lint.js'
      ],
      test: function() {
        return hintingTest('css') &&
               (typeof CSSLint !== 'undefined');
      },
      done: function(cm) {
        if (cm.getOption('mode') !== 'css') {
          return;
        }

        if (processors.css !== undefined && processors.css !== 'css') {
          return;
        }
        hintingDone(cm);
      }
    },
    jshint: {
      url: [
        // because jshint uses new style set/get - so we sniff for IE8 or lower
        // since it's the only one that doesn't have it
        $.browser.msie && $.browser.version < 9 ?
        '/js/vendor/jshint/jshint.old.min.js' :
        '/js/vendor/jshint/jshint.min.js',
      ],
      test: function() {
        return hintingTest('javascript') &&
               (typeof JSHINT !== 'undefined');
      },
      done: function(cm) {
        if (cm.getOption('mode') !== 'javascript') {
          return;
        }

        if (processors.javascript !== undefined && processors.javascript !== 'javascript') {
          return;
        }

        hintingDone(cm, {
          'eqnull': true
        });
      }
    },
    htmlhint: {
      url: [
        '/js/vendor/htmlhint/htmlhint.js',
        '/js/vendor/cm_addons/lint/html-lint.js'
      ],
      test: function() {
        return hintingTest('htmlmixed') &&
               (typeof HTMLHint !== 'undefined');
      },
      done: function(cm) {
        if (cm.getOption('mode') !== 'htmlmixed') {
          return;
        }

        if (processors.html !== undefined && processors.html !== 'html') {
          return;
        }

        hintingDone(cm);
      }
    },
    coffeescripthint: {
      url: [
        '/js/vendor/coffeelint/coffeelint.min.js',
        '/js/vendor/cm_addons/lint/coffeescript-lint.js'
      ],
      test: function() {
        return hintingTest('coffeescript') &&
               (typeof coffeelint !== 'undefined');
      },
      done: function(cm) {
        if (cm.getOption('mode') !== 'coffeescript' || jsbin.state.processors.javascript !== 'coffeescript') {
          return;
        }
        hintingDone(cm);
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
      return (typeof CodeMirror.optionHandlers[prop] !== 'undefined');
    };
  }

  function hintingTest(mode) {
    return (typeof CodeMirror.defaults.lint !== 'undefined') &&
           CodeMirror.helpers.lint &&
           CodeMirror.helpers.lint[mode] &&
           CodeMirror.optionHandlers.lint;
  }

  window.hintingDone = function(cm, defhintOptions) {
    var mode = cm.getOption('mode');
    if (mode === 'javascript') {
      mode = 'js';
    }
    if (mode === 'htmlmixed') {
      mode = 'html';
    }
    var opt = $.extend({}, settingsHintShow);
    opt.consoleParent = cm.getWrapperElement().parentNode.parentNode;
    setOption(cm, 'lintOpt', opt);
    setOption(cm, 'lintRules', $.extend({}, defhintOptions, jsbin.settings[mode + 'hintOptions']));
    if (opt.gutter) {
      var gutters = cm.getOption('gutters');
      if (gutters.indexOf('CodeMirror-lint-markers') === -1) {
        var copyGutters = gutters.slice();
        copyGutters.push('CodeMirror-lint-markers');
        setOption(cm, 'gutters', copyGutters);
      }
      setOption(cm, 'lint', {
        delay: 800
      });
      var ln = cm.getOption('lineNumbers');
      setOption(cm, 'lineNumbers', !ln);
      setOption(cm, 'lineNumbers', ln);
    } else {
      setOption(cm, 'lint', {
        delay: 800
      });
    }
    if (opt.console) {
      $document.trigger('sizeeditors');
      $(cm.consolelint.head).on('click', function() {
        if (!detailsSupport) {
          $(this).nextAll().toggle();
        }
        // trigger a resize after the click has completed and the details is close
        setTimeout(function () {
          $document.trigger('sizeeditors');
        }, 10);
      });
    }
  }

  var options = Object.keys(settingsAddons);

  function loadAddon(key) {
    var addon = addons[key];
    if (addon && settingsAddons[key]) {
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

  // External method to realod the selected addon
  // may be useful in the future
  // window.reloadSelectedAddon = function(addon) {
  //   if (options.indexOf(addon) !== -1) {
  //     loadAddon(addon);
  //   }
  // };

})();