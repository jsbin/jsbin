(function () {
  'use strict';
  var $saveStatus = $('span.status');
  var saveTimer = null;

  try { // shouldn't blow up, but... ¯\_(ツ)_/¯
    var editor = window.editor = CodeMirror.fromTextArea($('textarea')[0], $.extend({
      mode: 'text/css',
    }, jsbin.user.settings.editor));
  } catch (e) {}

  var $iframe = $('<iframe border="0">').css({
    width: '100%',
    border: '1px solid #ccc'
  });
  var iframe = $iframe[0];
  var navtemplate = $('#navigation-template');
  var stylePath = $('link[rel="stylesheet"]:last')[0].href.split('/');
  stylePath.splice(-1, 1, 'style.css');
  var globalStyle = stylePath.join('/');
  navtemplate.after(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write('<html class="embed">' + navtemplate.html() + '<link rel="stylesheet" href="' + globalStyle + '">');
  iframe.contentDocument.close();

  var $style = $('<style>');
  iframe.contentDocument.body.appendChild($style[0]);

  $('#panels', iframe.contentDocument.body)
    .append($('#panels-template').html());
  $(iframe.contentDocument.body).on('click', 'a', function () {
    return false;
  });

  // editor settings
  var settings = Object.keys(embed).length ? embed : jsbin.user.settings || {};
  var editorSettings = settings.editor || {};
  var $override = $('#override-settings').prop('checked', settings.override);
  var $font = $('#font-size').val(settings.font);
  var $theme = $('#theme').val(editorSettings.theme);
  var $tabSize = $('#tabSize').val(editorSettings.tabSize);
  var $lineWrapping = $('#lineWrapping').prop('checked', editorSettings.lineWrapping);
  var $lineNumbers = $('#lineNumbers').prop('checked', editorSettings.lineNumbers);
  var tabs = editorSettings.indentWithTabs;
  var $indentWithTabs = $('#indentWithTabs').prop('checked', tabs);
  $('#indentWithSpaces').prop('checked', !tabs);
  var $csrf = $('#_csrf');

  if (settings.css) {
    editor.setValue(settings.css);
  } else {
    settings.css = editor.getValue();
  }

  $style.text(settings.css);

  // listeners
  $('input[type="number"], input[type="text"]').on('input', saveSettings);
  $(':checkbox, :radio').on('change', saveSettings);
  $('select').on('change', saveSettings);

  CodeMirror.commands.save = saveSettings;
  editor.on('change', function () {
    $style.text(editor.getValue());
  });

  function saveSettings() {
    var settings = {
      editor: {},
      css: editor.getValue(),
    };

    console.log('saving');

    settings.override = $override.prop('checked');
    settings.font = parseInt($font.val(), 10);
    settings.editor.theme = $theme.val();
    settings.editor.tabSize = parseInt($tabSize.val(), 10);
    settings.editor.indentWithTabs = $indentWithTabs.prop('checked');
    settings.editor.lineWrapping = $lineWrapping.prop('checked');
    console.log(settings);
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: {
        settings: JSON.stringify(settings),
        _csrf: $csrf.val(),
      },
      success: function () {
        clearTimeout(saveTimer);
        $saveStatus.addClass('show');
        saveTimer = setTimeout(function () {
          $saveStatus.removeClass('show');
        }, 3000);
        if (console && console.log) {
          console.log('Success on saving settings');
        }
      },
      error: function (xhr, status) {
        if (console && console.log) {
          console.log('Error: ' + status);
        }
        $saveStatus.removeClass('show');
      },
    });
  }
})();