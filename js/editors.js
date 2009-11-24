var focusPanel = 'javascript';
var editors = {};

editors.html = CodeMirror.fromTextArea('html', {
  parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
  stylesheet: ["css/xmlcolors.css", "css/jscolors.css", "css/csscolors.css", "css/htmlcodeframe.css"],
  path: 'js/vendor/codemirror/',
  tabMode: 'shift',
  iframeClass: 'stretch codeframe',
  initCallback: function () {
    setupEditor('html');
  }
});

editors.javascript = CodeMirror.fromTextArea('javascript', {
  parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
  stylesheet: ["css/jscolors.css", "css/codeframe.css"],
  path: 'js/vendor/codemirror/',
  iframeClass: 'stretch codeframe javascript',
  tabMode: 'shift',
  initCallback: function () {
    setupEditor('javascript');
  }
});

function focused(event) {
  focusPanel = this.id;
  // console.log('focused ' + this.id);
}

function getFocusedPanel() {
  return focusPanel;
}

function setupEditor(panel) {
  var e = editors[panel];
  
  e.wrapping.style.position = 'static';
  e.wrapping.style.height = 'auto';
  e.win.document.id = 'html';
  $(e.win.document).bind('keydown', keycontrol);
  $(e.win.document).bind('focus', focused);
  
  // populate
  var data = sessionStorage.getItem(panel);
  var saved = localStorage.getItem('saved-' + panel);
  if (data) {
    e.setCode(data);
  } else if (saved) {
    e.setCode(saved);
  }
  
  if (sessionStorage.getItem('panel') == panel) {
    e.focus();
    e.selectLines(e.nthLine(sessionStorage.getItem('line')), sessionStorage.getItem('character'));
  }
}

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