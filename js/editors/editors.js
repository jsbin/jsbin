//= require "codemirror"
//= require "mobileCodeMirror"
//= require "library"
//= require "unsaved"
//= require "panel"
//= require "../render/live"

var panels = {};


panels.getVisible = function () {
  var panels = this.panels,
      visible = [];
  for (var panel in panels) {
    if (panels[panel].visible) visible.push(panels[panel]);
  }
  return visible;
};

panels.save = function () {
  var visible = this.getVisible(),
      state = {},
      panel;

  for (var i = 0; i < visible.length; i++) {
    panel = visible[i];
    state[panel.name] = panel.$el.css('left');
  }

  localStorage.setItem('jsbin.panels', JSON.stringify(state));
}

panels.restore = function () {
  // if there are panel names on the hash (v2 of jsbin) or in the jquery (v3)
  // then restore those specific panels and evenly distribute them.
  var open = [],
      location = window.location,
      toopen = (location.search.substring(1) ? location.search.substring(1) : location.hash.substring(1)).split(','),
      state = {};
      name = '',
      panel = null,
      innerWidth = window.innerWidth;

  // otherwise restore the user's regular settings

  // also set a flag indicating whether or not we should save the panel settings
  // this is based on whether they're on jsbin.com or if they're on an existing
  // bin. Also, if they hit save - *always* save their layout.
  if (location.pathname && location.pathname !== '/') {
    panels.saveOnExit = false;
  } else {
    panels.saveOnExit = true;
  }
  // TODO decide whether the above code I'm trying too hard.

  /* Boot code */
  // then allow them to view specific panels based on comma separated hash fragment
  if (toopen.length) {
    for (var i = 0; i < toopen.length; i++) {
      if (panels.panels[toopen[i]]) panels.panels[toopen[i]].show();
    }

    // support the old jsbin v1 links directly to the preview
    if (toopen.length === 1 && toopen[0] === 'preview') {
      panels.panels.live.show();
    }

    this.distribute();
  } else {
    state = JSON.parse(localStorage.getItem('jsbin.panels') || '{}');
    for (name in state) {
      panels.panels[name].show(innerWidth * parseFloat(state[name]) / 100);
    }
  }

  // now restore any data from sessionStorage
  // TODO add default templates somewhere
  var template = {};
  for (name in this.panels) {
    panel = this.panels[name];
    if (panel.editor) {
      panel.setCode(sessionStorage.getItem('jsbin.content.' + name) || template[name]);
    }
  }

};

panels.savecontent = function () {
  // loop through each panel saving it's content to sessionStorage
  var name, panel;
  for (name in this.panels) {
    panel = this.panels[name];
    if (panel.editor) sessionStorage.setItem('jsbin.content.' + name, panel.getCode());
  }

};

// evenly distribute the width of all the visible panels
panels.distribute = function () {
  var visible = panels.getVisible(),
      width = 100,
      innerWidth = window.innerWidth,
      left = 0,
      right = 0;

  if (visible.length) {
    visible = visible.sort(function (a, b) {
      return a.order < b.order ? -1 : 1;
    });

    width = 100 / visible.length;
    for (var i = 0; i < visible.length; i++) {
      right = 100 - (width * (i+1));
      visible[i].$el.css({ left: left + '%', right: right + '%' });
      visible[i].splitter.trigger('init', innerWidth * left/100);
      left += width;
    }
  }
};

// dirty, but simple
Panel.prototype.distribute = function () {
  panels.distribute();
};

jsbin.panels = panels;

var editors = panels.panels = {
  javascript: new Panel('javascript', { editor: true, nosplitter: true }),
  css: new Panel('css', { editor: true }),
  html: new Panel('html', { editor: true }),
  console: new Panel('console'),
  live: new Panel('live', { show: function () {
    // contained in live.js
    $(document).bind('codeChange.live', throttledPreview);
    renderLivePreview();
  }})
};

// IMPORTANT this is nasty, but the sequence is important, because the
// show/hide method is being called as the panels are being called as
// the panel is setup - so we hook these handlers on *afterwards*.
panels.updateURL = function () {
  var visiblePanels = panels.getVisible(),
      visible = [],
      i = 0;
  for (i = 0; i < visiblePanels.length; i++) {
    visible.push(visiblePanels[i].name);
  }

  if (history.replaceState) {
    history.replaceState(null, null, '?' + visible.join(','));
  } else {
    // :( this will break jquery mobile - but we're talking IE only at this point, right?
    location.hash = '#' + visible.join(',');
  }
}


Panel.prototype._show = Panel.prototype.show;
Panel.prototype.show = function () { 
  this._show.apply(this, arguments);
  panels.updateURL();
}

Panel.prototype._hide = Panel.prototype.hide;
Panel.prototype.hide = function () { 
  this._hide.apply(this, arguments);
  panels.updateURL();
}



panels.restore();

var editorsReady = setInterval(function () {
  var ready = true;
  for (var panel in panels.panels) {
    if (!panels.panels[panel].ready) ready = false;
  }

  if (ready) {
    clearInterval(editorsReady);
    // panels.ready = true;
    // if (typeof editors.onReady == 'function') editors.onReady();

    $(window).resize(function () {
      setTimeout(function () {
        $document.trigger('sizeeditors');
      }, 100);
    });

    $document.trigger('sizeeditors');
    $document.trigger('jsbinReady');
  }
}, 100);

/** disabled - moving to reusable panels */
false && (function () {
var focusPanel = 'javascript';
var editors = {};

window.editors = editors;

editors.html = CodeMirror.fromTextArea(document.getElementById('html'), {
  parserfile: [],
  tabMode: 'shift',
  mode: 'text/html',
  onChange: changecontrol,
  lineWrapping: true,
  theme: jsbin.settings.theme || 'jsbin'
});

editors.javascript = CodeMirror.fromTextArea(document.getElementById('javascript'), {
  mode: 'javascript',
  tabMode: 'shift',
  onChange: changecontrol,
  lineWrapping: true,
  theme: jsbin.settings.theme || 'jsbin'
});

setupEditor('javascript');
setupEditor('html');

var editorsReady = setInterval(function () {
  if (editors.html.ready && editors.javascript.ready) {
    clearInterval(editorsReady);
    editors.ready = true;
    if (typeof editors.onReady == 'function') editors.onReady();
    
    var scrollers = {
      html: $(editors.html.getScrollerElement()),
      javascript: $(editors.javascript.getScrollerElement())
    };
    
    $document.bind('sizeeditors', function () {
      var top = 0, //$el.offset().top,
          height = $('#bin').height();
      scrollers.html.height(height - top);
      scrollers.javascript.height(height - top - $error.filter(':visible').height());
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
  e.scroller = $(e.getScrollerElement());
  
  $(e.win).click(function () {
    e.focus();
  });
  
  var $label = $('.code.' + panel + ' > .label');
  if (document.body.className.indexOf('ie6') === -1) {
    e.scroller.scroll(function (event) {
      if (this.scrollTop > 10) {
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
  } else if (saved !== null && !/edit/.test(window.location) && !window.location.search) { // then their saved preference
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


function changecontrol(event) {
  // sends message to the document saying that a key has been pressed, we'll ignore the control keys
  // if (! ({ 16:1, 17:1, 18:1, 20:1, 27:1, 37:1, 38:1, 39:1, 40:1, 91:1, 93:1 })[event.which] ) {
    $(document).trigger('codeChange');
  // }
  
  return true;
}
}())

//= require "keycontrol"
