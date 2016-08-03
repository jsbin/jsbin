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
  var re = new RegExp('[ ;,]', 'g');
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

    var lines = field.value.split('\n');
    var line = lines[from.line];
    line = line.substring(0, from.ch) + value + line.substring(to.ch);
    lines[from.line] = line;

    field.value = lines.join('\n');

    var endPos = lines.slice(0, from.line - 1).join('\n').length + value.length + to.ch;

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

    $(this.textarea)
      .on(eventName, throttle(function () {
        update();
        $body.removeClass('editor-focus');
      }, 200))
      .on('focus', function () {
        hideOpen();
        $body.addClass('editor-focus');
      });

    if (options.initCallback) {
      $(options.initCallback);
    }

    this.commands = {};
    this.options = options;

    this.__update = update;
  };

  Editor.prototype = {
    replaceRange: insert,
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
    focus: noop,
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
      var start = (re.exec(line.substr(0, pos.char)) || { index: -1 }).index + 1;
      var end = (re.exec(line.substr(pos.char)) || { index: line.length }).index;
      var string = line.substr(start, end);

      return {
        start: start,
        end: end,
        string: string,
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
      return lines.slice(0, pos.line).join('\n').length + pos.ch + 1;
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
