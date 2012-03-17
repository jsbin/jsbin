var $document = $(document);

var editorModes = {
  html: 'text/html',
  javascript: 'javascript',
  css: 'css'
};

var Panel = function (name, settings) {
  var panel = this;
  panel.settings = settings;
  panel.name = name;
  panel.$el = $('.stretch.' + name);
  panel.el = document.getElementById(name);

  var splitterSettings = {};

  if (settings.editor) {
    panel.editor = CodeMirror.fromTextArea(panel.el, {
      parserfile: [],
      tabMode: 'shift',
      mode: editorModes[name],
      onChange: function () { $document.trigger('codeChange'); return true; },
      lineWrapping: true,
      theme: jsbin.settings.theme || 'jsbin'
    });

    panel._setupEditor(panel.editor, name);

    splitterSettings = {
      resize: function () {
        // fixes cursor position when the panel has been resized
        panel.editor.refresh();
      }
    };
  }

  panel.splitter = panel.$el.splitter().data('splitter');

  $document.bind('jsbinReady', function () {
    panel.splitter.trigger('init');
  });

  if (settings.beforeRender) {
    $document.bind('render', $.proxy(settings.beforeRender, panel));
  }
}

Panel.prototype = {
  visible: false,
  show: function () {
    this.$el.show();
    this.splitter.show();
    this.visible = true;

    // update all splitter positions

    // TODO save which panels are visible in their profile - but check whether it's their code
  },
  hide: function () {
    this.$el.hide();
    this.visible = false;

    // update all splitter positions
    this.splitter.hide();
  },
  toggle: function () {
    (this)[this.visible ? 'hide' : 'show']();
  },
  get: function () {
    if (this.editor) {
      return this.editor.getCode();
    }
  },
  set: function (content) {
    if (this.editor) {
      this.editor.setCode(content);
    }
  },
  render: function () {
    $document.trigger('render');
  },
  _setupEditor: function () {
    var focusedPanel = sessionStorage.getItem('panel'),
        panel = this,
        editor = panel.editor;

    // overhang from CodeMirror1
    editor.setCode = function (str) {
      //Cannot call method 'chunkSize' of undefined
      try {
        editor.setValue(str);
      } catch(err) {
        // console.error(e.id, err + '');
      }
    };

    editor.getCode = function () {
      return editor.getValue();
    };

    editor.currentLine = function () {
      var pos = editor.getCursor();
      return pos.line;
    };

    editor.setOption('onKeyEvent', keycontrol);
    this.settings.focus && editor.setOption('onFocus', $.proxy(this.settings.focus, this));

    editor.id = panel.name;

    editor.win = editor.getWrapperElement();
    editor.scroller = $(editor.getScrollerElement());

    $(editor.win).click(function () {
      editor.focus();
    });

    var $label = $('.code.' + panel.name + ' > .label');
    if (document.body.className.indexOf('ie6') === -1 && $label.length) {
      editor.scroller.scroll(function (event) {
        if (this.scrollTop > 10) {
          $label.stop().animate({ opacity: 0 }, 50, function () {
            $(this).hide();
          });
        } else {
          $label.show().stop().animate({ opacity: 1 }, 250);
        }
      });
    }

    $document.bind('sizeeditors', function () {
      var top = 0,
          height = panel.$el.closest('.stretch').height();
      editor.scroller.height(height - top);
      editor.refresh();
    });

    populateEditor(editor, panel.name);
    panel.ready = true;

    if (focusedPanel == panel.name || focusedPanel == null && panel.name == 'javascript') {
      editor.focus();
      editor.setCursor({ line: (sessionStorage.getItem('line') || 0) * 1, ch: (sessionStorage.getItem('character') || 0) * 1 });
    }
  }
};

function populateEditor(editor, panel) {
  // populate - should eventually use: session, saved data, local storage
  var data = sessionStorage.getItem(panel), // session code
      saved = localStorage.getItem('saved-' + panel), // user template
      sessionURL = sessionStorage.getItem('url'),
      changed = false;

  if (template && data == template[panel]) { // restored from original saved
    editor.setCode(data);
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