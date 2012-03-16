var editorModes = {
  html: 'text/html',
  javascript: 'javascript',
  css: 'css'
};

var Panel = function (name, settings) {
  this.el = document.getElementById(name);
  this.$el = $(this.el);

  if (settings.editor) {
    this.editor = CodeMirror.fromTextArea(this.el, {
      parserfile: [],
      tabMode: 'shift',
      mode: editorModes[name],
      onChange: function () { $document.trigger('codeChange'); return true; },
      lineWrapping: true,
      theme: jsbin.settings.theme || 'jsbin'
    });

    setupEditor(this.editor, name);
  }

  this.splitter = this.$el.splitter().data('splitter');
}

Panel.prototype = {
  visible: false,
  show: function () {
    this.$el.show();
    this.visible = true;

    // update all splitter positions
  },
  hide: function () {
    this.$el.hide();
    this.visible = false;

    // update all splitter positions
    
  },
  toggle: function () {
    (this)[this.visible ? 'hide' : 'show']();
  }
};

function setupEditor(e, panel) {
  var focusedPanel = sessionStorage.getItem('panel');

  // overhang from CodeMirror1
  e.setCode = function (str) {
    //Cannot call method 'chunkSize' of undefined
    try {
      e.setValue(str);
    } catch(err) {
      // console.error(e.id, err + '');
    }
  };

  e.getCode = function () {
    return e.getValue();
  };

  e.currentLine = function () {
    var pos = e.getCursor();
    return pos.line;
  };

  e.setOption('onKeyEvent', keycontrol);
  e.setOption('onFocus', focused);

  e.id = panel;

  e.win = e.getWrapperElement();
  e.scroller = $(e.getScrollerElement());

  $(e.win).click(function () {
    e.focus();
  });

  var $label = $('.code.' + panel + ' > .label');
  if (document.body.className.indexOf('ie6') === -1 && $label.length) {
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

  populateEditor(e, panel);
  e.ready = true;

  if (focusedPanel == panel || focusedPanel == null && panel == 'javascript') {
    e.focus();
    e.setCursor({ line: (sessionStorage.getItem('line') || 0) * 1, ch: (sessionStorage.getItem('character') || 0) * 1 });
  }
}

function populateEditor(editor, panel) {
  // populate - should eventually use: session, saved data, local storage
  var data = sessionStorage.getItem(panel), // session code
      saved = localStorage.getItem('saved-' + panel), // user template
      sessionURL = sessionStorage.getItem('url'),
      changed = false;

  if (template && data == template[panel]) { // restored from original saved
    editors[panel].setCode(data);
  } else if (data && sessionURL == template.url) { // try to restore the session first - only if it matches this url
    editor.setCode(data);
    // tell the document that it's currently being edited, but check that it doesn't match the saved template
    // because sessionStorage gets set on a reload
    changed = data != saved;
  } else if (saved !== null && !/edit/.test(window.location) && !window.location.search) { // then their saved preference
    editor.setCode(saved);
  } else { // otherwise fall back on the JS Bin default
    editor.setCode(template[panel]);
  }
  
  if (changed) {
    $document.trigger('codeChange', [ /* revert triggered */ false, /* don't use fade */ true ]);    
  }
}