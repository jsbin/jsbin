(function(){
  'use strict';

  /* global $ */

  function getCurrentSettings(){
    return JSON.parse(localStorage.settings || '{}') || {

    };
  }

  // Setup variables
  var $csrf = $('#_csrf');
  var currentSettings = {
    panels: [],
    includejs: false,
    focusedPanel: 'html'
  };
  $.extend(currentSettings, getCurrentSettings());
  var panels = ['html', 'css', 'js', 'console', 'live'];
  var $panels = {};
  var $includejs = $('#includejs').prop('checked', currentSettings.includejs);
  var $focusedPanel = $('#focused-panel').val(currentSettings.focusedPanel);

  for (var i = 0; i < panels.length; i++) {
    $panels[panels[i]] = $('#panel-' + panels[i])
      .prop('checked', currentSettings.panels.indexOf(panels[i]) !== -1);
  }

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

    localStorageSettings.includejs = $includejs.prop('checked');
    localStorageSettings.focusedPanel = $focusedPanel.val();

    localStorage.settings = JSON.stringify(localStorageSettings);
    console.log(localStorageSettings);

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