var $document = $(document),
    $source = $('#source');

var editorModes = {
  html: 'htmlmixed',
  javascript: 'javascript',
  css: 'css',
  markdown: 'markdown',
  coffeescript: 'coffeescript',
  less: 'css'
};

var Panel = function (name, settings) {
  var panel = this,
      showPanelButton = true,
      $panel = null,
      splitterSettings = {},
      cmSettings = {},
      panelLanguage = name;

  panel.settings = settings = settings || {};
  panel.id = panel.name = name;
  $panel = $('.panel.' + name);
  $panel.data('name', name);
  panel.$el = $panel.detach();
  panel.$el.appendTo($source);
  panel.$el.wrapAll('<div class="stretch panelwrapper">');
  panel.$el = panel.$el.parent().hide();
  panel.el = document.getElementById(name);
  panel.order = ++Panel.order;

  panel.$el.data('panel', panel);

  // keyboard shortcut (set in keyboardcontrol.js)
  panelShortcuts[panelShortcuts.start + panel.order] = panel.id;

  if (panel.order === 1) {
    settings.nosplitter = true;
  }

  if (jsbin.state.processors && jsbin.state.processors[name]) {
    panelLanguage = jsbin.state.processors[name];
    jsbin.processors.set(panel, jsbin.state.processors[name]);
  } else if (settings.processor) { // FIXME is this even used?
    panelLanguage = settings.processors[settings.processor];
    jsbin.processors.set(panel, settings.processor);
  } else {
    panel.processor = function (str) { return str; };
  }

  if (settings.editor) {
    cmSettings = {
      parserfile: [],
      tabMode: 'shift',
      readOnly: jsbin.state.embed ? 'nocursor' : false,
      dragDrop: false, // we handle it ourselves
      mode: editorModes[panelLanguage],
      onChange: function (event) { 
        $document.trigger('codeChange', [{ panelId: panel.id, revert: true }]); 
        return true; 
      },
      lineWrapping: true,
      theme: jsbin.settings.theme || 'jsbin'
    };

    $.extend(cmSettings, jsbin.settings.editor || {});
    panel.editor = CodeMirror.fromTextArea(panel.el, cmSettings);
    panel._setupEditor(panel.editor, name);
  }

  if (!settings.nosplitter) {
    panel.splitter = panel.$el.splitter(splitterSettings).data('splitter');
    panel.splitter.hide();
  } else {
    // create a fake splitter to let the rest of the code work
    panel.splitter = $();
  }

  if (settings.beforeRender) {
    $document.bind('render', $.proxy(settings.beforeRender, panel));
  }

  if (!settings.editor) {
    panel.ready = true;
  }

  // append panel to controls
  if (jsbin.state.embed) {
    // showPanelButton = window.location.search.indexOf(panel.id) !== -1;
  }

  if (showPanelButton) {
    this.controlButton = $('<a class="button group" href="#' + name + '">' + (settings.label || name) + '</a>');
    this.controlButton.click(function () {
      panel.toggle();
      return false;
    });
    this.controlButton.appendTo('#panels');
  }

  $panel.focus(function () {
    panel.focus();
  });
  $panel.add(this.$el.find('.label')).click(function () {
    panel.focus();
  });
};

Panel.order = 0;

Panel.prototype = {
  virgin: true,
  visible: false,
  show: function (x) {
    // check to see if there's a panel to the left.
    // if there is, take it's size/2 and make this our
    // width
    var panel = this,
        panelCount = panel.$el.find('.panel').length;

    analytics.showPanel(panel.id);

    // panel.$el.show();
    if (panel.splitter.length) {
      if (panelCount === 0 || panelCount > 1) {
        var $panel = $('.panel.' + panel.id).show();
        // $panel.next().show(); // should be the splitter...
        $panel.closest('.panelwrapper').show();
      } else {
        panel.$el.show();
      }
      panel.splitter.show();
    } else {
      panel.$el.show();
    }

    $body.addClass('panelsVisible');

    if (panel.settings.show) {
      panel.settings.show.call(panel, true);
    }
    panel.controlButton.addClass('active');
    panel.visible = true;

    // update the splitter - but do it on the next tick
    // required to allow the splitter to see it's visible first
    setTimeout(function () {
      if (x !== undefined) {
        panel.splitter.trigger('init', x);
      } else {
        panel.distribute();
      }
      if (panel.editor) {
        // populate the panel for the first time
        if (panel.virgin) {
          $(panel.editor.win).find('.CodeMirror-scroll .CodeMirror-lines, .CodeMirror-gutter-text').css('padding-top', panel.$el.find('.label').outerHeight());

          populateEditor(panel, panel.name);
        }
        if (!panel.virgin || jsbin.panels.ready) {
          panel.editor.focus();
          panel.focus();
        }
      } else {
        panel.focus();
      }
      // update all splitter positions
      $document.trigger('sizeeditors');

      panel.virgin = false;
  }, 0);

    // TODO save which panels are visible in their profile - but check whether it's their code
  },
  hide: function () {
    var panel = this;
    // panel.$el.hide();
    panel.visible = false;
    analytics.hidePanel(panel.id);

    // update all splitter positions
    // LOGIC: when you go to hide, you need to check if there's
    // other panels inside the panel wrapper - if there are
    // hide the nested panel and any previous visible splitter
    // if there's only one - then hide the whole thing.
    // if (panel.splitter.length) {
    var panelCount = panel.$el.find('.panel').length;
    if (panelCount === 0 || panelCount > 1) {
      var $panel = $('.panel.' + panel.id).hide();
      $panel.prev().hide(); // hide the splitter if there is one

      // TODO trigger a distribute horizontally
      if ($panel.closest('.panelwrapper').find('.panel:visible').length === 0) {
        $panel.closest('.panelwrapper').hide();
        // panel.splitter.hide();
        // TODO FIXME
      }
    } else {
      panel.$el.hide();
      panel.splitter.hide();
    }
    // } else {
    //   panel.$el.hide();
    // }
    if (panel.editor) {
      panel.controlButton.toggleClass('hasContent', !!$.trim(this.getCode()).length);
    }

    panel.controlButton.removeClass('active');
    panel.distribute();

    if (panel.settings.hide) {
      panel.settings.hide.call(panel, true);
    }

    // this.controlButton.show();
    setTimeout(function () {
      var visible = jsbin.panels.getVisible();
      if (visible.length) {
        jsbin.panels.focused = visible[0];
        if (jsbin.panels.focused.editor) {
          jsbin.panels.focused.editor.focus();
        } else {
          jsbin.panels.focused.$el.focus();
        }
        jsbin.panels.focused.focus();
      }

      $document.trigger('sizeeditors');
    }, 110);
  },
  toggle: function () {
    (this)[this.visible ? 'hide' : 'show']();
  },
  getCode: function () {
    if (this.editor) {
      return this.editor.getCode();
    }
  },
  setCode: function (content) {
    if (this.editor) {
      if (content === undefined) content = '';
      this.controlButton.toggleClass('hasContent', !!$.trim(content).length);
      this.codeSet = true;
      this.editor.setCode(content);
    }
  },
  codeSet: false,
  focus: function () {
    jsbin.panels.focus(this);
  },
  render: function () {
    var panel = this,
        ret = null;
    if (panel.editor) {
      return panel.processor(panel.getCode());
    } else if (this.visible && this.settings.render) {
      this.settings.render.apply(this, arguments);
    }
  },
  init: function () {
    if (this.settings.init) this.settings.init.call(this);
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
        // console.error(panel.id, err);
      }
    };


    editor.getCode = function () {
      return editor.getValue();
    };

    editor.currentLine = function () {
      var pos = editor.getCursor();
      return pos.line;
    };

    // editor.setOption('onKeyEvent', keycontrol);
    // editor.setOption('onFocus', function () {
      // panel.$el.trigger('focus');
    // });

    if (jsbin.mobile || jsbin.tablet) {
      editor._focus = editor.focus;
      editor.focus = function () {
        // console.log('ignoring manual call');
      };
    }

    editor.id = panel.name;

    editor.win = editor.getWrapperElement();
    editor.scroller = $(editor.getScrollerElement());

    $(editor.win).click(function () {
      editor.focus();
      panel.focus();
    });

    var $label = panel.$el.find('.label');
    if (document.body.className.indexOf('ie6') === -1 && $label.length) {
      editor.setOption('onScroll', function (event) {
        var scrollInfo = editor.getScrollInfo();
        if (scrollInfo.y > 10) {
          $label.stop().animate({ opacity: 0 }, 20, function () {
            $(this).hide();
          });
        } else {
          $label.show().stop().animate({ opacity: 1 }, 150);
        }
      });
    }

    var $error = null;
    $document.bind('sizeeditors', function () {
      if (panel.visible) {
        var height = panel.editor.scroller.closest('.panel').outerHeight(),
            offset = 0;
            // offset = panel.$el.find('> .label').outerHeight();

        // special case for the javascript panel
        if (panel.name === 'javascript') {
          if ($error === null) { // it wasn't there right away, so we populate
            $error = panel.$el.find('details');
          }
          offset += ($error.filter(':visible').height() || 0);
        }

        editor.scroller.height(height - offset);
        try { editor.refresh(); } catch (e) {}
      }
    });

    // required because the populate looks at the height, and at
    // this point in the code, the editor isn't visible, the browser
    // needs one more tick and it'll be there.
    setTimeout(function () {
      // if the panel isn't visible this only has the effect of putting
      // the code in the textarea (though probably costs us a lot more)
      // it has to be re-populated upon show for the first time because
      // it appears that CM2 uses the visible height to work out what
      // should be shown.
      panel.ready = true;
      populateEditor(panel, panel.name);

      if (focusedPanel == panel.name) {
        if (panel.visible) {
          // another fracking timeout to avoid conflict with other panels firing up
          setTimeout(function () {
            if (!jsbin.mobile && !jsbin.tablet) {
              editor.focus();
              editor.setCursor({ line: (sessionStorage.getItem('line') || 0) * 1, ch: (sessionStorage.getItem('character') || 0) * 1 });
            }
            panel.focus();
          }, 0);
        }
      }
    }, 0);
  },
  populateEditor: function () {
    populateEditor(this, this.name);
  }
};

function populateEditor(editor, panel) {
  if (!editor.codeSet) {
    // populate - should eventually use: session, saved data, local storage
    var cached = sessionStorage.getItem('jsbin.content.' + panel), // session code
        saved = localStorage.getItem('saved-' + panel), // user template
        sessionURL = sessionStorage.getItem('url'),
        changed = false;

    if (sessionURL !== template.url) {
      // nuke the live saving checksum
      sessionStorage.removeItem('checksum');
      saveChecksum = false;
    }

    if (template && cached == template[panel]) { // restored from original saved
      editor.setCode(cached);
    } else if (cached && sessionURL == template.url) { // try to restore the session first - only if it matches this url
      editor.setCode(cached);
      // tell the document that it's currently being edited, but check that it doesn't match the saved template
      // because sessionStorage gets set on a reload
      changed = cached != saved && cached != template[panel];
    } else if (saved !== null && !/edit/.test(window.location) && !window.location.search) { // then their saved preference
      editor.setCode(saved);
    } else { // otherwise fall back on the JS Bin default
      editor.setCode(template[panel]);
    }
  } else {
    // this means it was set via the url
    changed = true;
  }

  if (changed) {
    $document.trigger('codeChange', [ { revert: false, onload: true } ]);
  }
}