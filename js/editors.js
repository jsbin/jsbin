var htmleditor = CodeMirror.fromTextArea('html', {
  parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
  stylesheet: ["css/xmlcolors.css", "css/jscolors.css", "css/csscolors.css", "css/htmlcodeframe.css"],
  path: "js/vendor/codemirror/",
  iframeClass: 'stretch codeframe',
  initCallback: function () {
    var seq = 0;
    htmleditor.win.document.id = 'html';
    $(htmleditor.win.document).bind('keydown', keycontrol);
  }
});

var jseditor = CodeMirror.fromTextArea('javascript', {
  parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
  stylesheet: ["css/jscolors.css", "css/codeframe.css"],
  path: "js/vendor/codemirror/",
  iframeClass: 'stretch codeframe javascript',
  tabMode: 'shift',
  initCallback: function () {
    jseditor.focus();
    jseditor.selectLines(jseditor.nthLine(sessionStorage.getItem('line')), sessionStorage.getItem('character'));
    jseditor.win.document.id = 'javascript';
    $(jseditor.win.document).bind('keydown', keycontrol);
  }
});

htmleditor.wrapping.style.position = 'static';
htmleditor.wrapping.style.height = 'auto';
jseditor.wrapping.style.position = 'static';
jseditor.wrapping.style.height = 'auto';

function keycontrol(event) {
  if (event.ctrlKey == true && event.keyCode == 39 && this.id == 'javascript') {
    // go right
    htmleditor.focus();
    $('#bin').removeClass('javascript');
    return false;
  } else if (event.ctrlKey == true && event.keyCode == 37 && this.id == 'html') {
    // go left
    jseditor.focus();
    $('#bin').addClass('javascript');
    return false;
  }
}