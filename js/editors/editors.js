//= require <codemirror>
//= require "libraries"
var focusPanel = 'javascript';
var editors = {};
editors.html = CodeMirror.fromTextArea('html', {
  parserfile: ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"],
  stylesheet: ["/css/xmlcolors.css", "/css/jscolors.css", "/css/csscolors.css", "/css/htmlcodeframe.css"],
  path: '/js/vendor/codemirror/',
  tabMode: 'shift',
  iframeClass: 'stretch codeframe',
  initCallback: function () {
    setupEditor('html');
  }
});

editors.javascript = CodeMirror.fromTextArea('javascript', {
  parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
  stylesheet: ["/css/jscolors.css", "/css/codeframe.css"],
  path: '/js/vendor/codemirror/',
  iframeClass: 'stretch codeframe javascript',
  tabMode: 'shift',
  initCallback: function () {
    setupEditor('javascript');
  }
});

function focused(event) {
  focusPanel = this.id;
  $('#bin').toggleClass('javascript', this.id == 'javascript');
  $(editors.html.win.document).find('body').removeClass('focus');
  $(editors.javascript.win.document).find('body').removeClass('focus');
  $(this).find('body').addClass('focus');
}

function getFocusedPanel() {
  return focusPanel;
}

function setupEditor(panel) {
  var e = editors[panel], 
      focusedPanel = sessionStorage.getItem('panel');
  
  e.wrapping.style.position = 'static';
  e.wrapping.style.height = 'auto';
  e.win.document.id = panel;
  $(e.win.document).bind('keydown', keycontrol);
  $(e.win.document).focus(focused);
  
  var $label = $('.code.' + panel + ' > .label');
  $(e.win.document).bind('scroll', function (event) {
    if (this.body.scrollTop > 10) {
      $label.stop().animate({ opacity: 0 }, 50, function () {
        $(this).hide();
      });
    } else {
      $label.show().stop().animate({ opacity: 1 }, 250);
    }
  });
  
  populateEditor(panel);
  
  if (focusedPanel == panel || focusedPanel == null && panel == 'javascript') {
    e.focus();
    e.selectLines(e.nthLine(sessionStorage.getItem('line')), sessionStorage.getItem('character'));
  }
}

function populateEditor(panel) {
  // populate - should eventually use: session, saved data, local storage
  var data = sessionStorage.getItem(panel);
  var saved = localStorage.getItem('saved-' + panel);
  if (data) { // try to restore the session first
    editors[panel].setCode(data);
  } else if (saved && !/edit/.test(window.location)) { // then their saved preference
    editors[panel].setCode(saved);
  } else { // otherwise fall back on the JS Bin default
    editors[panel].setCode(template[panel]);
  }
}

function keycontrol(event) {
  var ctrl = event.ctrlKey == true;
  
  if (ctrl && event.keyCode == 39 && this.id == 'javascript') {
    // go right
    editors.html.focus();
    return false;
  } else if (ctrl && event.keyCode == 37 && this.id == 'html') {
    // go left
    editors.javascript.focus();
    return false;
  } else if (ctrl && event.keyCode == 49) { // 49 == 1 key
    $('#control a.source').click();
  } else if (ctrl && event.keyCode == 50) {
    $('#control a.preview').click();
  }
  
  // sends message to the document saying that a key has been pressed, we'll ignore the control keys
  if (! ({ 16:1, 17:1, 18:1, 20:1, 27:1, 37:1, 38:1, 39:1, 40:1, 91:1, 93:1 })[event.keyCode] ) {
    $(document).trigger('codeChange');
  }
  
  return true;
}