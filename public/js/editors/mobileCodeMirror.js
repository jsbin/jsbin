/* globals jsbin, throttle, $, $body, CodeMirror, $document */
var noop = function () {};
var rootClassName = document.body.className;
var oldCodeMirror = null;

var simple = jsbin.settings.editor && jsbin.settings.editor.simple;

if (simple ||
    jsbin.mobile ||
    jsbin.tablet ||
    rootClassName.indexOf('ie6') !== -1 ||
    rootClassName.indexOf('ie7') !== -1) {
  $('body').addClass('mobile');
  enableMobileMirror();
}

function enableMobileMirror() {
  var re = /\b./g;
  jsbin.lameEditor = true;

  var setCursor = function (sPos, ePos) {
    if (!ePos) {
      ePos = sPos;
    }
    var field = this.textarea;
    var value = field.value;
    field.value = ''; // hack to reset the cursor position
    field.value = value;
    if (field.setSelectionRange) {
      field.setSelectionRange(sPos, ePos);
    } else if (field.createTextRange) {
      var range = field.createTextRange();
      range.collapse(true);
      if (sPos < 0) {
        sPos = field.value.length + sPos;
      }
      range.moveEnd('character', ePos);
      range.moveStart('character', sPos);
      range.select();
    }
  }

  var insert = function (value, from, to) {
    var field = this.textarea;
    if (value === undefined || value === null) {
      value = '';
    }

    if (!from) {
      from = this.getCursor();
    }

    if (!to) {
      to = from;
      if (this.textarea.selectionEnd !== this.textarea.selectionStart) {
        to = this.posFromIndex(this.textarea.selectionEnd);
      }
    }

    var prev = field.value;
    var lines = field.value.split('\n');
    var line = lines[from.line];
    line = line.substring(0, from.ch) + value + line.substring(to.ch);
    lines[from.line] = line;

    field.value = lines.join('\n');

    var endPos = lines.slice(0, from.line).join('\n').length + 1 + from.ch + value.length; // +1 for missing ln
    //lines.slice(0, from.line - 1).join('\n').length + value.length + to.ch - 1;

    setCursor.call({ textarea: field }, endPos);
  };

  var Editor = function (el, options) {
    this.textarea = el;
    this.win = { document: this.textarea };
    this.ready = true;
    this.wrapping = document.createElement('div');

    var textareaParent = this.textarea.parentNode;
    this.wrapping.appendChild(this.textarea);
    textareaParent.appendChild(this.wrapping);

    this.textarea.style.opacity = 1;
    // this.textarea.style.width = '100%';

    var eventName = jsbin.mobile || jsbin.tablet ? 'blur' : 'keyup';
    var old = null;

    var update = function () {
      if (old !== el.value) {
        old = el.value;
        $document.trigger('codeChange', { panelId: el.id });
      }
    };

    $document.on('jsbinReady', function () {
      old = el.value;
    });

    $(this.textarea)
      .on(eventName, throttle(function () {
        update();
        $body.removeClass('editor-focus');
      }, 200))
      .on('focus', function () {
        hideOpen();
        $body.addClass('editor-focus');
      })
      .on('touchstart', function () {
        completionIndex = -1; // reset the completion
      })
      .on('keypress', function () {
        completionIndex = -1; // reset the completion
      });

    if (options.initCallback) {
      $(options.initCallback);
    }

    this.commands = {};
    this.options = options;

    this.__update = update;
  };

  var completionIndex = -1;
  var completionCache = [];
  var lastToken = null;

  Editor.prototype = {
    _hasCompletions: function () {
      return completionIndex !== -1;
    },
    _completionIndex: completionIndex,
    _showCompletion: function (completions, token) {
      if (completionIndex === -1) {
        // reset
        console.log(completions);
        completionCache = completions;
        lastToken = token;
        console.log(token);
      }

      // else, show the next completion
      completionIndex++;
      if (completionIndex >= completionCache.length) {
        completionIndex = 0;
      }
      var pos = this.getCursor();
      var i = this.indexFromPos(pos);
      var value = completionCache[completionIndex].substr(lastToken.string.length);
      insert.call(this, value);
      this.setCursor(i, i + value.length); // highlight the section

      return;
    },
    cursorCoords: function (from) {
      var pos = getCaretCoordinates(this.textarea, this.textarea.selectionEnd);
      pos.bottom = pos.top; // hack for CM
      return pos;
    },
    replaceRange: function () {
      this._completionIndex = -1;
      return insert.apply(this, arguments);
    },
    getMode: function () {
      return this.options.mode;
    },
    Pos: function (line, ch) {
      return {
        line: line,
        ch: ch,
      };
    },
    getWrapperElement: function () {
      return this.wrapping;
    },
    getScrollerElement: function () {
      return this.textarea;
    },
    setOption: function (type, handler) {
      if (type === 'onChange') {
        $(this.textarea).change(handler);
      }
    },
    setCode: function (code) {
      this.textarea.value = code;
    },
    getOption: noop,
    getCode: function () {
      return this.textarea.value;
    },
    getLine: function (n) {
      return this.textarea.value.split('\n')[n - 1];
    },
    getValue: function () {
      return this.textarea.value;
    },
    setValue: function (code)  {
      this.textarea.value = code;
    },
    focus: function () {
      this.textarea.focus();
    },
    getCursor: function () {
      var p = this.cursorPosition().character;
      var lines = this.textarea.value.substring(0, p).split('\n');
      var line = lines.length - 1;
      var char = lines[line].length;
      return {
        line: line,
        char: char,
        ch: char,
      };
    },
    getTokenAt: function (pos) {
      var line = this.textarea.value.split('\n')[pos.line];
      var frag = line.substr(0, pos.char);
      var start = -1;
      line.replace(re, function (m, i) {
        if (line.substr(i).trim()) { // ignore the end of the line
          start = i;
        }
      });

      //var start = (re.exec(line.substr(0, pos.char)) || { index: -1 }).index + 1;
      var end = (re.exec(line.substr(pos.char)) || { index: line.length }).index;
      var string = line.substr(start, end);

      // TODO validate string is made up entirely of \w characters
      if (!(/^\w+$/g).test(string)) {
        string = '';
      }

      return {
        start: start,
        end: end,
        string: string.trim(),
        type: 'variable',
        state: {
          mode: this.options.mode,
        },
      };
    },
    setCursor: setCursor,
    currentLine: function () {
      return 0;
    },
    defaultTextHeight: function () {
      return 16;
    },
    highlightLines: function () {
      return {
        string: '',
      };
    },
    removeKeyMap: noop,
    addKeyMap: noop,
    indentLine: noop,
    cursorPosition: function () {
      var character = 0;
      if (this.textarea.selectionStart) {
        character = this.textarea.selectionStart;
      } else if (this.textarea.createTextRange) {
        var range = this.textarea.createTextRange();
        character = range.startOffset;
      }
      return { character: character };
    },
    nthLine: noop,
    refresh: noop,
    selectLines: noop,
    on: noop,
    somethingSelected: noop,
    indexFromPos: function (pos) {
      var lines = this.textarea.value.split('\n');
      return lines.slice(0, pos.line).join('').length + pos.ch + pos.line;
    },
    posFromIndex: function (i) {
      var lines = this.textarea.value.substr(0, i).split('\n');
      var line = lines.length - 1;
      return {
        line: line,
        ch: lines[line].length,
      };
    },
    getRange: function (start, end) {
      return this.textarea.value.substring(this.indexFromPos(start), this.indexFromPos(end));
    },
    getModeAt: function () {
      var name = this.options.mode;
      if (name === 'htmlmixed') {
        name = 'html';
      }
      return { name: name };
    },
    setSelections: function (sel) {
      setCursor.call(this, this.indexFromPos(sel[0].anchor), this.indexFromPos(sel[0].head));
    },
    listSelections: function () {
      return [{
        head: this.getCursor(),
        anchor: this.getCursor(),
      }];
    },
    operation: function (fn) {
      fn();
      // return fn;
    }
  };

  oldCodeMirror = CodeMirror;
  CodeMirror = noop;

  for (var key in oldCodeMirror) {
    CodeMirror[key] = noop;
  }

  // copy across some useful stuff
  ['Pass', 'hint', 'snippets', 'execCommand', 'simpleHint', 'commands'].forEach(function (key) {
    CodeMirror[key] = oldCodeMirror[key];
  });

  CodeMirror.fromTextArea = function (el, options) {
    return new Editor(el, options);
  };

  CodeMirror.keyMap = { basic: {} };
}
