(function(){
  'use strict';

  /* globals $ */
  var $csrf = $('#_csrf');

  $('#generate-key').click(function () {
    $.ajax({
      method: 'post',
      data: {
        _csrf: $csrf.val(),
      },
      url: '/account/new-api-key',
      type: 'json',
      success: function (res) {
        $('#api_key').text(res.api_key);
      },
      error: function (error) {
        alert(error.message);
      }
    });

    return false;
  });

  $('form.login').submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var name = form.find('input[name=username]').val();
    var key = form.find('input[name=password]').val();
    var email = form.find('input[name=email]').val();
    var subscribed = form.find('input[name=subscribed]').prop('checked');
    var beta = form.find('input[name=beta]').prop('checked');
    var $loginFeedback = form.find('.loginFeedback');

    $loginFeedback.show().text('Checking...');

    $.ajax({
      url: form.attr('action'),
      data: {
        username: name,
        key: key,
        email: email,
        subscribed: subscribed,
        beta: beta,
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