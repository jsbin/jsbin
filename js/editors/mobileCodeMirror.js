// yeah, nasty, but it allows me to switch from a RTF to plain text if we're running a iOS
if (/WebKit.*Mobile.*/.test(navigator.userAgent) || document.body.className.indexOf('ie6') !== -1) {
  Editor = function (id, options) {
    this.textarea = document.getElementById(id);
    this.win = { document : this.textarea };
    this.ready = true;
    this.wrapping = document.createElement('div');
    
    var textareaParent = this.textarea.parentNode;
    this.wrapping.appendChild(this.textarea);
    textareaParent.appendChild(this.wrapping);
    
    this.textarea.style.opacity = 1;
    this.textarea.style.width = '100%';
    
    $(options.initCallback);
  };
  
  Editor.prototype = {
    setCode: function (code) {
      this.textarea.value = code;
    },
    getCode: function () {
      return this.textarea.value;
    },
    focus: function () {
      // this.textarea.focus(); // not that this would ever work on mobile
    },
    currentLine: function () {
      return 0;
    },
    cursorPosition: function () {
      return { character: 0 };
    },
    nthLine: function () {},
    selectLines: function () {}
  };
  
  CodeMirror = function () {};

  CodeMirror.fromTextArea = function (lang, options) {
      return new Editor(lang, options);
  };
}