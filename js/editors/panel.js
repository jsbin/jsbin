var $document = $(document);

var editorModes = {
  html: 'text/html',
  javascript: 'javascript',
  css: 'css'
};

var Panel = function (name, settings) {
  var panel = this;
  panel.settings = settings = settings || {};
  panel.name = name;
  panel.$el = $('.panel.' + name);
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

    // splitterSettings = {
    //   resize: function () {
    //     // fixes cursor position when the panel has been resized
    //     panel.editor.refresh();
    //   }
    // };
  } 

  if (!settings.nosplitter) {
    panel.splitter = panel.$el.splitter(splitterSettings).data('splitter');
  } else {
    // create a fake splitter to let the rest of the code work
    panel.splitter = $();
  }

  $document.bind('jsbinReady', function () {
    panel.splitter.trigger('init');
  });

  if (settings.beforeRender) {
    $document.bind('render', $.proxy(settings.beforeRender, panel));
  }

  if (!settings.editor) {
    panel.ready = true;
  }

  // append panel to controls

  this.controlButton = $('<a class="button group" href="#' + name + '">' + name + '</a>');
  this.controlButton.click(function () {
    panel.toggle();
  });
  this.controlButton.appendTo('#panels');

  this.$el.find('.label p').click(function () {
    panel.hide();
  });

  panel.hide();
}

Panel.prototype = {
  visible: false,
  show: function () {
    // check to see if there's a panel to the left.
    // if there is, take it's size/2 and make this our
    // width
    var panel = this;
    var prev = panel.$el.prev(':visible').prev(':visible'),
        x,
        width;
    if (prev.length) {
      width = prev.width() / 2;
      x = prev.offset().left + width;
      panel.$el.css('left', prev.offset().left + width);
      if (width) panel.$el.width(width);
    } else {
      panel.$el.css({ width: '100%', left: 0 });
      x = 0;
    }
    panel.$el.show();
    panel.splitter.show();
    panel.splitter.trigger('init', x);
    panel.visible = true;

    panel.controlButton.hide();

    // update all splitter positions

    // TODO save which panels are visible in their profile - but check whether it's their code
  },
  hide: function () {
    this.$el.hide();
    this.visible = false;

    // update all splitter positions
    this.splitter.hide();
    this.controlButton.show();
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
          height = panel.$el.closest('.panel').height();
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