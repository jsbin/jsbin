(function(){
  'use strict';

  /* globals $ */

  $('#flag-user').submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var username = form.find('input[name=username]').val();
    var $responseFeedback = form.find('.responseFeedback');

    $responseFeedback.show().text('Checking...');

    $.ajax({
      url: form.attr('action'),
      data: {
        username: username
      },
      type: 'POST',
      dataType: 'json',
      complete: function (jqXHR) {
        var data = $.parseJSON(jqXHR.responseText) || {};
        if (jqXHR.status === 200) {
          if (data.message) {
            $responseFeedback.text(data.message);
          }
        }
      }
    });
  });

})();