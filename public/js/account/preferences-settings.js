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
  var hintShow = {
    console: true,
    line: false,
    // under: false,
    // tooltip: true,
    gutter: false
  };
  var currentSettings = {
    panels: [],
    includejs: true,
    focusedPanel: 'html',
    assetUrl: '',
    hintShow: hintShow,
    jshint: true,
    jshintOptions: '',
    csshint: false,
    csshintOptions: '',
    htmlhint: false,
    htmlhintOptions: '',
    coffeescripthint: false,
    coffeescripthintOptions: '',
    layout: 0,
  };
  var $saveStatus = $('span.status');
  var saveTimer = null;
  $.extend(currentSettings, getCurrentSettings());
  var panels = ['html', 'css', 'javascript', 'console', 'live'];
  var $panels = {};
  var $includejs = $('#includejs').prop('checked', currentSettings.includejs);
  var $focusedPanel = $('#focused-panel').val(currentSettings.focusedPanel);
  var $layout = $('#layout').val(currentSettings.layout);
  var $assetUrl = $('#asset-url').val(currentSettings.assetUrl);
  var hints = ['js', 'css', 'html', 'coffeescript'];
  var $ssl = $('#ssl'); // .prop('checked', currentSettings.ssl); // checking happens server side
  var $hints = {};
  var $hintsOptions = {};
  var $hintsOptWrapper = {};
  var hintsOptionsVal = {};
  var $hintsOptError = {};
  var $hintShow = {};

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
    $hintsOptWrapper[hints[m]] = $('.' + hints[m] + 'hintOptWrapper')
      .toggle(currentSettings[ hints[m] + 'hint' ]);
    $hints[hints[m]] = $('#' + hints[m] + 'hint')
      .prop('checked', currentSettings[ hints[m] + 'hint' ])
      .on('click', { el: $hintsOptWrapper[hints[m]] }, function(event) {
        event.data.el.toggle(this.checked);
      });

    hintsOptionsVal[hints[m]] = JSON.stringify(currentSettings[ hints[m] + 'hintOptions'], undefined, 2);

    if (hintsOptionsVal[hints[m]] === '{}' || !currentSettings[ hints[m] + 'hintOptions']) {
      hintsOptionsVal[hints[m]] = '';
    }
    $hintsOptions[hints[m]] = $('#' + hints[m] + 'hintOptions')
      .val(hintsOptionsVal[hints[m]]);
    $hintsOptError[hints[m]] = $('#' + hints[m] + 'hintOptError');
  }
  $hintShow = {};
  for (var key in hintShow) {
    if (hintShow.hasOwnProperty(key)) {
      $hintShow[key] = $('#hintShow-' + key).prop('checked', currentSettings.hintShow[key]);
    }
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
  $('input:not([type=checkbox])').on('blur', saveSettings);
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
      $hintsOptError[ hints[m] ].html('').removeClass('show');
      try {
        localStorageSettings[ hints[m] + 'hintOptions' ] = JSON.parse($hintsOptions[ hints[m] ].val() || '{}');
      } catch (e) {
        $hintsOptError[ hints[m] ].html(e).addClass('show');
      }
    }
    localStorageSettings.hintShow = {};
    for (var key in hintShow) {
      if (hintShow.hasOwnProperty(key)) {
        localStorageSettings.hintShow[key] = $hintShow[key].prop('checked');
      }
    }

    localStorageSettings.includejs = $includejs.prop('checked');
    localStorageSettings.focusedPanel = $focusedPanel.val();
    localStorageSettings.assetUrl = $assetUrl.val();
    localStorageSettings.ssl = $ssl.prop('checked');
    localStorageSettings.layout = $layout.val();

    localStorage.settings = JSON.stringify(localStorageSettings);

    clearTimeout(saveTimer);
    $saveStatus.addClass('show');

    // Save on server
    $.ajax({
      beforeSend: function () {
        clearTimeout(saveTimer);
        $saveStatus.addClass('show');
      },
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