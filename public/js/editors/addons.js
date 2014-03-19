(function () {
  'use strict';
  /*globals $, jsbin, CodeMirror*/

  var defaults = {
    closebrackets: true,
    highlight: false,
    vim: false,
    emacs: false,
    trailingspace: false,
    fold: false
  };

  if (!jsbin.settings.addons) {
    jsbin.settings.addons = defaults;
  }

  var addons = {
    closebrackets: {
      url: '/js/vendor/codemirror3/addon/edit/closebrackets.js',
      test: defaultTest('autoCloseBrackets'),
      done: function (cm) {
        setOption(cm, 'autoCloseBrackets', true);
      }
    },
    highlight: {
      url: '/js/vendor/codemirror3/addon/search/match-highlighter.js',
      test: defaultTest('highlightSelectionMatches'),
      done: function (cm) {
        setOption(cm, 'highlightSelectionMatches', true);
      }
    },
    vim: {
      url: [
        '/js/vendor/codemirror3/addon/dialog/dialog.css',
        '/js/vendor/codemirror3/keymap/vim.js',
        '/js/vendor/codemirror3/addon/dialog/dialog.js',
        '/js/vendor/codemirror3/addon/search/searchcursor.js'
      ],
      test: defaultTest('vimMode'),
      done: function (cm) {
        setOption(cm, 'vimMode', true);
        setOption(cm, 'showCursorWhenSelecting', true);
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
      test: function () {
        return CodeMirror.prototype.getSearchCursor &&
               CodeMirror.optionHandlers.matchBrackets &&
               CodeMirror.optionHandlers.openDialog &&
               CodeMirror.commands.find &&
               CodeMirror.optionHandlers.lineComment &&
               CodeMirror.keyMap.emacs;
      },
      done: function (cm) {
        setOption(cm, 'keyMap', 'emacs');
      }
    },
    matchtags: {
      url: [
        '/js/vendor/codemirror3/addon/fold/xml-fold.js',
        '/js/vendor/codemirror3/addon/edit/matchtags.js'
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
      url: '/js/vendor/codemirror3/addon/edit/trailingspace.js',
      test: defaultTest('showTrailingSpace'),
      done: function (cm) {
        setOption(cm, 'showTrailingSpace', true);
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
        setOption(cm, 'gutters', ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']);
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

  /**
   * This was a good idea at the time, but then it does weird things in
   * production. I don't know why, so I've commented it out, and left it
   * here because it was kinda awesome at the time. For now, it'll be
   * compressed out of sight.
   */

  // if (Object.defineProperty && jsbin.settings) {
  //   options.forEach(function (addon) {
  //     try {
  //       var value = jsbin.settings.addons[addon];

  //       Object.defineProperty(jsbin.settings.addons, addon, {
  //         configurable: true,
  //         enumerable: true,
  //         get: function () {
  //           return value;
  //         },
  //         set: function (newValue) {
  //           value = newValue;
  //           if (value) {
  //             loadAddon(addon);
  //           } else {
  //             var fn = addons[addon].done.toString();
  //             var opts = [];
  //             fn.replace(/setOption\(cm, (.*),.*;/g, function (all, opt) {
  //               opts.push(opt.replace(/['"]/g, ''));
  //             });

  //             jsbin.panels.allEditors(function (panel) {
  //               if (panel.editor) {
  //                 opts.forEach(function (opt) {
  //                   panel.editor.setOption(opt, false);
  //                 });
  //               }
  //             });

  //           }
  //         }
  //       });
  //     } catch (e) {
  //       // IE8 seems to attempt the code above, but it totally fails
  //     }
  //   });
  // }

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

})();