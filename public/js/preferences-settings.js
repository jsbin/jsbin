(function(){
  'use strict';

  /* global $, CodeMirror, jshint */

  function getCurrentSettings(){
    return JSON.parse(localStorage.settings || '{}') || {

    };
  }

  window.jsbin = {
    'settings': {
      'jshintOption': null
    }
  };

  window.editors = {
    'javascript': {
      'editor': null,
      'visible': true
    }
  };

  $.browser = {};
  // work out the browser platform
  var ua = navigator.userAgent;
  if (ua.indexOf(' Mac ') !== -1) {
    $.browser.platform = 'mac';
  } else if (/windows|win32/.test(ua)) {
    $.browser.platform = 'win';
  } else if (/linux/.test(ua)) {
    $.browser.platform = 'linux';
  } else {
    $.browser.platform = '';
  }

  // Setup variables
  var $csrf = $('#_csrf');
  var currentSettings = {
    panels: [],
    includejs: true,
    focusedPanel: 'html',
    jshint: true,
    jshintOptions: {}
  };
  $.extend(currentSettings, getCurrentSettings());
  var panels = ['html', 'css', 'javascript', 'console', 'live'];
  var $panels = {};
  var $includejs = $('#includejs').prop('checked', currentSettings.includejs);
  var $focusedPanel = $('#focused-panel').val(currentSettings.focusedPanel);
  var hints = ['js', 'css'];
  var $hints = {};

  var jshints = {
    'forin': 'About unsafe <code>for..in</code>',
    'eqnull': 'About <code>== null</code>',
    'noempty': 'About empty blocks',
    'eqeqeq': 'About unsafe comparisons',
    'boss': 'About assignments inside <code>if/for/...</code>',
    'undef': 'When variable is undefined',
    'unused': 'When variable is defined but not used',
    'curly': 'When blocks omit <code>{}</code>'
  };
  var $jshints = {};
  var source = '';

  for (var i = 0; i < panels.length; i++) {
    $panels[panels[i]] = $('#panel-' + panels[i])
      .prop('checked', currentSettings.panels.indexOf(panels[i]) !== -1);
  }

  for (var m = 0; m < hints.length; m++) {
    $hints[hints[m]] = $('#' + hints[m] + 'hint')
      .prop('checked', currentSettings[ hints[m] + 'hint' ]);
  }

  for (var prop in jshints) {
    if (jshints.hasOwnProperty(prop)) {
      source += '<div><label for="' + prop + '">' + jshints[prop] + '</label>' +
        '<input id="' + prop + '" type="checkbox">' +
        '</div>';
    }
  }
  $('#jshintOptions').append(source);
  for (var prop in jshints) {
    if (jshints.hasOwnProperty(prop)) {
      $jshints[prop] = $('#' + prop).prop('checked', currentSettings.jshintOptions[ prop ]);
    }
  }

  var $textarea = $('#editor-settings-example');
  editors.javascript.editor = CodeMirror.fromTextArea($textarea.get(0), $.extend({
    mode: 'text/javascript'
  }, currentSettings.editor));

  editors.javascript.editor.getCode = function () {
    return editors.javascript.editor.getValue();
  };

  // Listeners
  $(':checkbox').on('change', saveSettings);
  $('select').on('change', saveSettings);

  function saveSettings() {
    // Merge all our settings together
    var localStorageSettings = JSON.parse(localStorage.settings || '{}');

    localStorageSettings.panels = [];
    for (var i = 0; i < panels.length; i++) {
      if ($panels[panels[i]].prop('checked')) {
        localStorageSettings.panels.push(panels[i]);
      }
    }

    for (var m = 0; m < hints.length; m++) {
      localStorageSettings[ hints[m] + 'hint' ] = $hints[hints[m]].prop('checked');
    }

    localStorageSettings.includejs = $includejs.prop('checked');
    localStorageSettings.focusedPanel = $focusedPanel.val();

    localStorageSettings.jshintOptions = {};
    for (var prop in jshints) {
      if (jshints.hasOwnProperty(prop)) {
        localStorageSettings.jshintOptions[ prop ] = $jshints[prop].prop('checked');
      }
    }

    localStorage.settings = JSON.stringify(localStorageSettings);
    console.log(localStorageSettings);

    window.jsbin.settings.jshintOption = localStorageSettings.jshintOptions;
    jshint();

    // Save on server
    $.ajax({
      url: 'editor',
      type: 'POST',
      dataType: 'json',
      data: {
        settings: JSON.stringify(localStorageSettings),
        _csrf: $csrf.val()
      },
      success: function() {
        // console.log('success');
      },
      error: function() {
        // console.log('there was an error saving');
      }
    });
  }

})();