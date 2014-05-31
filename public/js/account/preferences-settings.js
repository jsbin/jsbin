(function(){
  'use strict';

  /* global $ */

  function getCurrentSettings(){
    return JSON.parse(localStorage.settings || '{}') || {

    };
  }

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
    jshintOptions: '{}',
    assetUrl: '',
  };
  var $saveStatus = $('span.status');
  var saveTimer = null;
  $.extend(currentSettings, getCurrentSettings());
  var panels = ['html', 'css', 'javascript', 'console', 'live'];
  var $panels = {};
  var $includejs = $('#includejs').prop('checked', currentSettings.includejs);
  var $focusedPanel = $('#focused-panel').val(currentSettings.focusedPanel);
  var $assetUrl = $('#asset-url').val(currentSettings.assetUrl);
  var hints = ['js'];
  var $hints = {};
  var $hintsOptions = {};
  var $hintsOptWrapper = {};
  var hintsOptionsVal = {};

  // var jshints = {
  //   'forin': 'About unsafe <code>for..in</code>',
  //   'eqnull': 'About <code>== null</code>',
  //   'noempty': 'About empty blocks',
  //   'eqeqeq': 'About unsafe comparisons',
  //   'boss': 'About assignments inside <code>if/for/...</code>',
  //   'undef': 'When variable is undefined',
  //   'unused': 'When variable is defined but not used',
  //   'curly': 'When blocks omit <code>{}</code>'
  // };
  // var source = '';

  for (var i = 0; i < panels.length; i++) {
    $panels[panels[i]] = $('#panel-' + panels[i])
      .prop('checked', currentSettings.panels.indexOf(panels[i]) !== -1);
  }

  for (var m = 0; m < hints.length; m++) {
    $hintsOptWrapper[hints[m]] = $('#' + hints[m] + 'hintOptWrapper')
      .toggle(currentSettings[ hints[m] + 'hint' ]);
    $hints[hints[m]] = $('#' + hints[m] + 'hint')
      .prop('checked', currentSettings[ hints[m] + 'hint' ])
      .on('click', { el: $hintsOptWrapper[hints[m]] }, function(event) {
        event.data.el.toggle(this.checked);
      });
    hintsOptionsVal[hints[m]] = JSON.stringify(currentSettings[ hints[m] + 'hintOptions'], undefined, 2);
    if (hintsOptionsVal[hints[m]] === '{}') {
      hintsOptionsVal[hints[m]] = '';
    }
    $hintsOptions[hints[m]] = $('#' + hints[m] + 'hintOptions')
      .val(hintsOptionsVal[hints[m]]);
  }

  // for (var prop in jshints) {
  //   if (jshints.hasOwnProperty(prop)) {
  //     source += '<div><label for="' + prop + '">' + jshints[prop] + '</label>' +
  //       '<input id="' + prop + '" type="checkbox">' +
  //       '</div>';
  //   }
  // }

  // Listeners
  $(':checkbox').on('change', saveSettings);
  $('select').on('change', saveSettings);
  $('input').on('blur', saveSettings);
  $('textarea').on('blur', saveSettings);

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
      localStorageSettings[ hints[m] + 'hintOptions' ] = JSON.parse($hintsOptions[ hints[m] ].val() || '{}');
    }

    localStorageSettings.includejs = $includejs.prop('checked');
    localStorageSettings.focusedPanel = $focusedPanel.val();
    localStorageSettings.assetUrl = $assetUrl.val();

    localStorage.settings = JSON.stringify(localStorageSettings);
    console.log(localStorageSettings);

    clearTimeout(saveTimer);
    $saveStatus.addClass('show');

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
        if (console && console.log) {
          console.log('Success on saving settings');
        }
      },
      error: function(xhr, status) {
        if (console && console.log) {
          console.log('Error: ' + status);
        }
      },
      complete: function () {
        saveTimer = setTimeout(function () {
          $saveStatus.removeClass('show');
        }, 1000);
      }
    });
  }

})();