(function(){
  'use strict';

  /* globals $ */

  $('form.login').submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var name = form.find('input[name=username]').val();
    var key = form.find('input[name=password]').val();
    var email = form.find('input[name=email]').val();
    var subscribed = form.find('input[name=subscribed]').prop('checked');
    var $loginFeedback = form.find('.loginFeedback');
    var $csrf = $('#_csrf');

    $loginFeedback.show().text('Checking...');

    $.ajax({
      url: form.attr('action'),
      data: {
        username: name,
        key: key,
        email: email,
        subscribed: subscribed,
        _csrf: $csrf.val()
      },
      type: 'POST',
      dataType: 'json',
      complete: function (jqXHR) {
        var data = $.parseJSON(jqXHR.responseText) || {};
        if (jqXHR.status === 200) {
          if (data.message) {
            $loginFeedback.text(data.message);
          }
        }
      }
    });
  });

})();