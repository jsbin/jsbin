// = require <codemirror>
//= require "codemirror"
//= require "mobileCodeMirror"
//= require "library"
//= require "unsaved"
//= require "autocomplete"
var focusPanel = 'javascript';
var editors = {};

window.editors = editors;

editors.html = CodeMirror.fromTextArea(document.getElementById('html'), {
  parserfile: [],
  tabMode: 'shift',
  mode: 'text/html',
  onChange: changecontrol,
  theme: jsbin.settings.theme
});

editors.javascript = CodeMirror.fromTextArea(document.getElementById('javascript'), {
  mode: 'javascript',
  tabMode: 'shift',
  onChange: changecontrol,
  theme: jsbin.settings.theme
});

setupEditor('javascript');
setupEditor('html');

var editorsReady = setInterval(function () {
  if (editors.html.ready && editors.javascript.ready) {
    clearInterval(editorsReady);
    editors.ready = true;
    if (typeof editors.onReady == 'function') editors.onReady();
    
    $document.bind('sizeeditors', function () {
      var $el = $(editors.html.win),
          top = 0, //$el.offset().top,
          height = $('#bin').height();
      $el.height(height - top);
      $(editors.javascript.win).height(height - top - $error.filter(':visible').height());
      editors.javascript.refresh();
      editors.html.refresh();
    });
    
    $(window).resize(function () {
      setTimeout(function () {
        $document.trigger('sizeeditors');
      }, 100);
    });
    
    $document.trigger('sizeeditors');
    $document.trigger('jsbinReady');
  }
}, 100);


function focused(editor, event) {
  focusPanel = editor.id;
}

function getFocusedPanel() {
  return focusPanel;
}

function setupEditor(panel) {
  var e = editors[panel], 
      focusedPanel = sessionStorage.getItem('panel');

  // overhang from CodeMirror1
  e.setCode = function (str) {
    e.setValue(str);
  };

  e.getCode = function () {
    return e.getValue();
  };
  
  e.currentLine = function () {
    var pos = e.getCursor();
    return pos.line;
  };
  
  e.setOption('onChange', changecontrol);
  e.setOption('onKeyEvent', keycontrol);
  e.setOption('onFocus', focused);

  e.id = panel;

  e.win = e.getWrapperElement();
  
  $(e.win).click(function () {
    e.focus();
  });
  
  var $label = $('.code.' + panel + ' > .label');
  if (document.body.className.indexOf('ie6') === -1) {
    e.setOption('onScroll', function (event) {
      if (e.win.scrollTop > 10) {
        $label.stop().animate({ opacity: 0 }, 50, function () {
          $(this).hide();
        });
      } else {
        $label.show().stop().animate({ opacity: 1 }, 250);
      }
    });    
  }
  
  populateEditor(panel);
  e.ready = true;
  
  if (focusedPanel == panel || focusedPanel == null && panel == 'javascript') {
    // e.selectLines(e.nthLine(sessionStorage.getItem('line')), sessionStorage.getItem('character'));
    e.focus();
    e.setCursor({ line: (sessionStorage.getItem('line') || 0) * 1, ch: (sessionStorage.getItem('character') || 0) * 1 });
  }
}


function populateEditor(panel) {
  // populate - should eventually use: session, saved data, local storage
  var data = sessionStorage.getItem(panel), // session code
      saved = localStorage.getItem('saved-' + panel), // user template
      sessionURL = sessionStorage.getItem('url'),
      changed = false;

  if (data == template[panel]) { // restored from original saved
    editors[panel].setCode(data);
  } else if (data && sessionURL == template.url) { // try to restore the session first - only if it matches this url
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

function keycontrol(panel, event) {
  var ctrl = event.ctrlKey; //accessKey(event);

  if (ctrl && event.which == 39 && panel.id == 'javascript') {
    // go right
    editors.html.focus();
    event.stop();
  } else if (ctrl && event.which == 37 && panel.id == 'html') {
    // go left
    editors.javascript.focus();
    event.stop();
  } else if (ctrl && event.which == 49) { // 49 == 1 key
    $('#control a.source').click();
    event.stop();
  } else if (event.which == 191 && event.shiftKey && event.metaKey) {
    // show help
    console.log('showing help - TBI');
    event.stop();
  } else if (ctrl && event.which == 50) {
    $('#control a.preview').click();
    event.stop();
  } else if (event.which == 27) {
    event.stop();
    return startComplete(panel);
  } else if (event.which == 190 && event.altKey && event.metaKey && panel.id == 'html') {
    // auto close the element
    if (panel.somethingSelected()) return;
    // Find the token at the cursor
    var cur = panel.getCursor(false), token = panel.getTokenAt(cur), tprop = token;
    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = tprop = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                       className: token.string == "." ? "js-property" : null};
    }
    
    panel.replaceRange('</' + token.state.htmlState.context.tagName + '>', {line: cur.line, ch: token.end}, {line: cur.line, ch: token.end});
    event.stop();
  } else if (event.which == 188 && event.ctrlKey && event.shiftKey) {
    // start a new tag
    event.stop();
    return startTagComplete(panel);
  } else if (event.which == 191 && event.metaKey) {
    // auto close the element
    if (panel.somethingSelected()) return;
    
    var cur = panel.getCursor(false), 
        token = panel.getTokenAt(cur),
        type = token && token.state && token.state.token ? token.state.token.name : 'javascript',
        line = panel.getLine(cur.line);

    if (type == 'css') {
      if (line.match(/\s*\/\*/) !== null) {
        // already contains comment - remove
        panel.setLine(cur.line, line.replace(/\/\*\s?/, '').replace(/\s?\*\//, ''));
      } else {
        // panel.replaceRange('// ', {line: cur.line, ch: 0}, {line: cur.line, ch: 0});      
        panel.setLine(cur.line, '/* ' + line + ' */');
      }
    } else if (type == 'javascript') {
      // FIXME - could put a JS comment next to a <script> tag
      if (line.match(/\s*\/\//) !== null) {
        // already contains comment - remove
        panel.setLine(cur.line, line.replace(/(\s*)\/\/\s?/, '$1'));
      } else {
        // panel.replaceRange('// ', {line: cur.line, ch: 0}, {line: cur.line, ch: 0});      
        panel.setLine(cur.line, '// ' + line);
      }      
    } else if (type == 'html') {
      if (line.match(/\s*<!--/) !== null) {
        // already contains comment - remove
        panel.setLine(cur.line, line.replace(/<!--\s?/, '').replace(/\s?-->/, ''));
      } else {
        // panel.replaceRange('// ', {line: cur.line, ch: 0}, {line: cur.line, ch: 0});      
        panel.setLine(cur.line, '<!-- ' + line + ' -->');
      }      
    }

    event.stop();
  }
  
  // return true;
}

function changecontrol(event) {
  // sends message to the document saying that a key has been pressed, we'll ignore the control keys
  // if (! ({ 16:1, 17:1, 18:1, 20:1, 27:1, 37:1, 38:1, 39:1, 40:1, 91:1, 93:1 })[event.which] ) {
    $(document).trigger('codeChange');
  // }
  
  return true;
}
