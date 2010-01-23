//= require <codemirror>
//= require "library"
//= require "unsaved"
var focusPanel = 'javascript';
var editors = {};
editors.html = CodeMirror.fromTextArea('html', {
  basefiles: ['basefiles.js'],
  parserfile: [],
  stylesheet: ["/css/codemirror.css", "/css/htmlcodeframe.css"],
  path: '/js/vendor/codemirror/',
  tabMode: 'shift',
  iframeClass: 'stretch codeframe',
  initCallback: function () {
    setupEditor('html');
  }
});

editors.javascript = CodeMirror.fromTextArea('javascript', {
  basefiles: ['basefiles.js'],
  parserfile: ['parsejavascript.js'], // forces a switch back to JS parsing
  stylesheet: ["/css/codemirror.css", "/css/codeframe.css"],
  path: '/js/vendor/codemirror/',
  iframeClass: 'stretch codeframe javascript',
  tabMode: 'shift',
  initCallback: function () {
    setupEditor('javascript');
  }
});

var editorsReady = setInterval(function () {
  if (editors.html.ready && editors.javascript.ready) {
    clearInterval(editorsReady);
    editors.ready = true;
    if (typeof editors.onReady == 'function') editors.onReady();
  }
}, 100);

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
  
  e.ready = true;
  e.wrapping.style.position = 'static';
  e.wrapping.style.height = 'auto';
    
  e.win.document.id = panel;
  $(e.win.document).bind('keydown', keycontrol);
  $(e.win.document).bind('keyup', changecontrol);
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
  var data = sessionStorage.getItem(panel),
      saved = localStorage.getItem('saved-' + panel),
      changed = false;
  
  if (data == template[panel]) { // restored from original saved
    editors[panel].setCode(data);
  } else if (data) { // try to restore the session first
    editors[panel].setCode(data);
    // tell the document that it's currently being edited, but check that it doesn't match the saved template
    // because sessionStorage gets set on a reload
    changed = data != saved;
  } else if (saved && !/edit/.test(window.location) && !window.location.search) { // then their saved preference
    editors[panel].setCode(saved);
  } else { // otherwise fall back on the JS Bin default
    editors[panel].setCode(template[panel]);
  }
  
  if (changed) {
    $(document).trigger('codeChange', [ /* revert triggered */ false, /* don't use fade */ true ]);    
  }
}

// work out the browser platform
var ua = navigator.userAgent;
if (/macintosh|mac os x/.test(ua)) { 
  $.browser.platform = 'mac'; 
} else if (/windows|win32/.test(ua)) { 
  $.browser.platform = 'win'; 
} else if (/linux/.test(ua)) { 
  $.browser.platform = 'linux'; 
} else { 
  $.browser.platform = ''; 
} 


// Based on http://en.wikipedia.org/wiki/Access_key
function accessKey(event) {
  var on = false;
  if ($.browser.webkit) {
    if ($.browser.platform == 'win') {
      on = event.altKey;
    } else { // mac
      if ($.browser.version < 4) {
        on = event.ctrlKey;
      } else {
        on = event.ctrlKey && event.altKey;      
      }
    }
  } else if ($.browser.mozilla) {
    on = event.shiftKey && event.altKey;
  } else if ($.browser.msie) {
    on = event.altKey;
  } 
  // Opera requires completely different handling, will set aside for now and issues are raised, I'll fix this too.
  
  return on;
}

function keycontrol(event) {
  var ctrl = accessKey(event);
  
  if (ctrl && event.which == 39 && this.id == 'javascript') {
    // go right
    editors.html.focus();
    return false;
  } else if (ctrl && event.which == 37 && this.id == 'html') {
    // go left
    editors.javascript.focus();
    return false;
  } else if (ctrl && event.which == 49) { // 49 == 1 key
    $('#control a.source').click();
    return false;
  } else if (ctrl && event.which == 50) {
    $('#control a.preview').click();
    return false;
  }
  
  return true;
}

function changecontrol(event) {
  // sends message to the document saying that a key has been pressed, we'll ignore the control keys
  if (! ({ 16:1, 17:1, 18:1, 20:1, 27:1, 37:1, 38:1, 39:1, 40:1, 91:1, 93:1 })[event.which] ) {
    $(document).trigger('codeChange');
  }
  
  return true;
}