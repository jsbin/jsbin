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
  console.log('focused ' + this.id);
  focusPanel = this.id;
  console.log('ok', this.id);
  $('#bin').toggleClass('javascript', this.id == 'javascript');
  $(editors['html'].win.document).find('body').removeClass('focus');
  $(editors['javascript'].win.document).find('body').removeClass('focus');
  $(this).find('body').addClass('focus');
}

function getFocusedPanel() {
  return focusPanel;
}

function setupEditor(panel) {
  var e = editors[panel];
  
  e.wrapping.style.position = 'static';
  e.wrapping.style.height = 'auto';
  e.win.document.id = panel;
  $(e.win.document).bind('keydown', keycontrol);
  $(e.win.document).focus(focused);
  
  // console.log(panel, e.win.document);
  
  populateEditor(panel);
  
  if (sessionStorage.getItem('panel') == panel) {
    e.focus();
    e.selectLines(e.nthLine(sessionStorage.getItem('line')), sessionStorage.getItem('character'));
  }
}

function populateEditor(panel) {
  // populate - should eventually use: session, saved data, local storage
  var data = sessionStorage.getItem(panel);
  var saved = localStorage.getItem('saved-' + panel);
  if (data) {
    editors[panel].setCode(data);
  } else if (saved) {
    editors[panel].setCode(saved);
  }
}

function keycontrol(event) {
  if (event.ctrlKey == true && event.keyCode == 39 && this.id == 'javascript') {
    // go right
    editors['html'].focus();
    return false;
  } else if (event.ctrlKey == true && event.keyCode == 37 && this.id == 'html') {
    // go left
    editors['javascript'].focus();
    return false;
  }
}