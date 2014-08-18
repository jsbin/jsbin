(function(){
  'use strict';

  /* globals $ */

  $('#flag-user').submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var username = form.find('input[name=username]').val();
    var $csrf = $('#_csrf');
    var $responseFeedback = form.find('.responseFeedback');

    $responseFeedback.show().text('Checking...');

    $.ajax({
      url: form.attr('action'),
      data: {
        username: username,
        _csrf: $csrf.val()
      },
      type: 'POST',
      dataType: 'json',
      complete: function (jqXHR) {
        var data = $.parseJSON(jqXHR.responseText) || {};
        if (jqXHR.status === 200) {
          $responseFeedback.show().text('User flagged succesfully');
        }
      }
    });
  });

})();