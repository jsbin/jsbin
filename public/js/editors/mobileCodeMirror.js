// yeah, nasty, but it allows me to switch from a RTF to plain text if we're running a iOS
var noop = function () {};

if (document.body.className.indexOf('ie6') !== -1 || document.body.className.indexOf('ie7') !== -1) {
  $('body').addClass('mobile');
  jsbin.lameEditor = true;
  Editor = function (el, options) {
    this.textarea = el;
    this.win = { document : this.textarea };
    this.ready = true;
    this.wrapping = document.createElement('div');

    var textareaParent = this.textarea.parentNode;
    this.wrapping.appendChild(this.textarea);
    textareaParent.appendChild(this.wrapping);

    this.textarea.style.opacity = 1;
    // this.textarea.style.width = '100%';

    $(this.textarea).keyup(throttle(function () {
      $(document).trigger('codeChange', { panelId: el.id });
    }, 200));

    options.initCallback && $(options.initCallback);
  };

  Editor.prototype = {
    getWrapperElement: function () {
      return this.wrapping;
    },
    getScrollerElement: function () {
      return this.textarea;
    },
    setOption: function (type, handler) {
      if (type == 'onChange') {
        $(this.textarea).change(handler);
      }
    },
    setCode: function (code) {
      this.textarea.value = code;
    },
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
    cursorPosition: function () {
      return { character: 0 };
    },
    nthLine: noop,
    refresh: noop,
    selectLines: noop
  };
  
  CodeMirror = function () {};

  CodeMirror.fromTextArea = function (el, options) {
      return new Editor(el, options);
  };
}