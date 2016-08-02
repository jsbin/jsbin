/* globals jsbin, throttle, $, $body, CodeMirror, $document */
var noop = function () {};
var rootClassName = document.body.className;

var simple = jsbin.settings.editor && jsbin.settings.editor.simple;

if (simple ||
    jsbin.mobile ||
    jsbin.tablet ||
    rootClassName.indexOf('ie6') !== -1 ||
    rootClassName.indexOf('ie7') !== -1) {
  enableMobileMirror();
}

function enableMobileMirror() {
  $('body').addClass('mobile');
  jsbin.lameEditor = true;
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

    this.__update = update;
  };

  Editor.prototype = {
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
    getValue: function () {
      return this.textarea.value;
    },
    setValue: function (code)  {
      this.textarea.value = code;
    },
    focus: noop,
    getCursor: function () {
      return { line: 0, ch: 0 };
    },
    setCursor: noop,
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
      return { character: 0 };
    },
    nthLine: noop,
    refresh: noop,
    selectLines: noop,
    on: noop,
  };

  var _oldCM = CodeMirror;

  CodeMirror = noop;

  for (var key in _oldCM) {
    CodeMirror[key] = noop;
  }

  CodeMirror.fromTextArea = function (el, options) {
    return new Editor(el, options);
  };

  CodeMirror.keyMap = { basic: {} };
}
