/*global jsbin, $*/

var settings = {
  save: function (callback) {
    localStorage.setItem('settings', JSON.stringify(jsbin.settings));
    if (!callback) {
      callback = function () {};
    }

    $.ajax({
      url: '/account/editor',
      type: 'POST',
      dataType: 'json',
      data: {
        settings: localStorage.settings,
        _csrf: jsbin.state.token
      },
      success: function () {
        if (console && console.log) {
          console.log('settings saved');
        }
        callback(true);
      },
      error: function (xhr, status) {
        callback(false);
      }
    });
  }
};