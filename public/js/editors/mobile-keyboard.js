(function () {
  /* globals jsbin, $, escapeHTML, $document, editors, commandMaps */
  if (!jsbin.mobile || jsbin.embed) {
    return;
  }

  var getCursor = function (field) {
    if (field.selectionStart) {
      return field.selectionStart;
    }
    if (field.createTextRange) {
      var range = field.createTextRange();
      return range.startOffset;
    }
  };

  var getTA = function () {
    return jsbin.panels.focused.editor.textarea;
  };

  var mobileUtils = {
    next: function () {

    },
    close: function (needle) {
      var ta = getTA();
      var pos = getCursor(ta);
      // look backwards
      var tagposition = ta.value.substring(0, pos).lastIndexOf(needle);
      if (needle === '>') {
        var start = 0;
        while (start > -1) {
          start = ta.value.substring(0, tagposition).lastIndexOf('<') + 1;
          var c = ta.value.substr(start, 1);
          if (c === '/') {
            // we've got another closing tag, move back
            var matched = ta.value.substr(start + 1, ta.value.substr(start).indexOf('>') - 1);
            tagposition = ta.value.lastIndexOf('<' + matched);
            continue;
          }

          if (c === '!') {
            return '';
          }

          if (start === 0) {
            return '';
          }
          break;
        }

        var tail = ta.value.substr(start, tagposition).indexOf(needle);
        return '</' + ta.value.substr(start, tail) + '>$0';
      }
    },
    complete: function () {
      var focused = jsbin.panels.focused;
      if (focused.id === 'html' || focused.id === 'css') {
        CodeMirror.commands['emmet.expand_abbreviation_with_tab'].call(null, focused.editor);
      } else if (focused.editor._hasCompletions && focused.editor._hasCompletions()) {
        focused.editor._showCompletion();
      } else {
        CodeMirror.commands.autocomplete(focused.editor);
      }
      focused.editor.focus();
    },
  };

  var buttons = {
    html: $(),
    css: $(),
    js: $(),
    console: $(),
    all: $(),
  };

  var makeCommand = function (command) {
    var button = $('<button>');
    var toinsert = command.value;
    var label = command.value.replace(/\$0/, '');
    if (!command.callback) {
      command.callback = function () {
        return toinsert;
      };
    }

    button.on('click', function () {
      var focused = jsbin.panels.focused;
      if (focused.editor) {
        var pos = focused.editor.getCursor();
        var value = command.callback.call(mobileUtils);
        if (value == null) {
          return;
        }
        var resetTo = value.indexOf('$0');
        if (resetTo === -1) {
          resetTo = 0;
        }
        var offset = focused.editor.cursorPosition().character + resetTo;
        if (pos !== -1) {
          value = value.replace('$0', '');
        }
        focused.editor.replaceRange(value, pos, pos);
        focused.editor.setCursor(offset);

        focused.editor.textarea.focus();
      } else if (focused.id === 'console') {
        focused.setCursorTo(command.callback().replace('\$0', ''), true);
        focused.$el.click();
      }
    });

    button.html(escapeHTML(label));
    strip.find('div').append(button);

    if (command.panel) {
      if (typeof command.panel === 'string') {
        buttons[command.panel] = buttons[command.panel].add(button);
      } else {
        command.panel.forEach(function (p) {
          buttons[p] = buttons[p].add(button);
        });
      }
      buttons.all = buttons.all.add(button);
    }
  };

  var strip = $('<div id="strip"><div class="inner-strip"></div></div>');

  commandMaps.map(makeCommand);

  $('body').append(strip);

  var hideAll = function (panel) {
    return function () {
      buttons.all.hide();
      if (buttons[panel]) {
        buttons[panel].show();
      }
    };
  };

  $document.on('jsbinReady', function () {
    // hook up which buttons should be shown and when
    editors.html.on('show', hideAll('html'));
    editors.css.on('show', hideAll('css'));
    editors.javascript.on('show', hideAll('js'));
    editors.console.on('show', hideAll('console'));
    hideAll(jsbin.panels.focused.id === 'javascript' ? 'js' : jsbin.panels.focused.id)();
  });
})();
