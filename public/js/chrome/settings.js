/*global jsbin, $*/

var settings = {
  save: function () {
    localStorage.setItem('settings', JSON.stringify(jsbin.settings));

    $.ajax({
      url: '/account/editor',
      type: 'POST',
      dataType: 'json',
      data: {
        settings: localStorage.settings,
        _csrf: jsbin.state.token
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
      }
    });
  }
};