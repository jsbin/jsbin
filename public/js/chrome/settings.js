/*globals: font:true, jsbin:true*/
(function () {

  var root = $(document.documentElement),
      head = $('head');

  // if (jsbin.settings.editor.theme) {
  //   root.addClass('cm-s-' + jsbin.settings.editor.theme);
  // }

  $('#profile .userSettings').submit(function () {
    return false;
  });

  var editorOptionMap = {
    'settings-lineNumbers': 'lineNumbers',
    'settings-lineWrapping': 'lineWrapping'
  };

  $('#profile .userSettings input, #profile .userSettings select').on('change input', function () {
    var id = this.id;
    if (this.type === 'checkbox') {
      // bool
      var on = this.checked === true,
          key = editorOptionMap[this.id];

      jsbin.settings.editor[key] = on;

      jsbin.panels.allEditors(function (panel) {
        panel.editor.setOption(key, on);
      });
    } else {
      // string
      if (id === 'settings-font') {
        font(this.value);
      } else if (id === 'settings-theme') {
        var theme = this.value;
        if (jsbin.settings.editor.theme) {
          root.removeClass('cm-s-' + jsbin.settings.editor.theme);
          // lame
          if (theme === 'solarized-light') {
            root.removeClass('.cm-s-light');
          }
        }
        jsbin.settings.editor.theme = theme;
        root.addClass('cm-s-' + theme);

        if (theme.indexOf('solarized') === 0) {
          if (theme.indexOf('light') !== 0) {
            root.addClass('.cm-s-light');
          }
          theme = 'solarized';
        }

        head.find('link.theme').remove();

        if (theme !== 'default') {
          head.append('<link class="theme" rel="stylesheet" href="' + jsbin.static + '/js/vendor/codemirror3/theme/' + theme + '.css">');
        }

        jsbin.panels.allEditors(function (panel) {
          panel.editor.setOption('theme', theme);
        });

      }
    }

    jsbin.panels.allEditors(function (panel) {
      panel.editor.refresh();
    });
  }).each(function () {
    var id = this.id;
    if (this.type === 'checkbox') {
      // bool
      $(this).attr('checked', jsbin.settings.editor[editorOptionMap[this.id]]);
    } else {
      // string
      if (id === 'settings-font') {
        this.value = jsbin.settings.font || 14;
      } else if (id === 'settings-theme') {
        if (jsbin.settings.editor.theme) {
          $(this).val(jsbin.settings.editor.theme);
        }
      }
    }
  }).trigger('change');

})();