/* global $ */

$('form.login').submit(function (event) {
  'use strict';
  event.preventDefault();

  var form = $(this),
      name = form.find('input[name=username]').val(),
      key = form.find('input[name=password]').val(),
      email = form.find('input[name=email]').val(),
      $loginFeedback = form.find('.loginFeedback');


  // jsbin.settings.home = name; // will save later
  $loginFeedback.show().text('Checking...');

  $.ajax({
    url: form.attr('action'),
    data: { username: name, key: key, email: email },
    type: 'POST',
    dataType: 'json',
    complete: function (jqXHR) {
      var data = $.parseJSON(jqXHR.responseText) || {};
      // cookie is required to share with the server so we can do a redirect on new bin
      if (jqXHR.status === 200) {
        if (data.avatar) {
          $('a.avatar').find('img').remove().end().prepend('<img src="' + data.avatar + '">');
        }
        if (data.message) {
          $loginFeedback.text(data.message);
        } else {
          window.location = window.location.pathname + window.location.search;
        }
      } else {
        analytics.login(false);
        $loginFeedback.text(data.message || ('"' + name + '" has already been taken. Please either double check the password, or choose another username.'));
      }
    }
  });
});
