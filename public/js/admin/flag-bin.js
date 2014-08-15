(function(){
  'use strict';

  /* globals $ */

  $('#flag-bin').submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var bin = form.find('input[name=bin]').val();
    var $responseFeedback = form.find('.responseFeedback');

    console.log(bin);

    // $responseFeedback.show().text('Checking...');

    // $.ajax({
    //   url: form.attr('action'),
    //   data: {
    //     bin: bin
    //   },
    //   type: 'POST',
    //   dataType: 'json',
    //   complete: function (jqXHR) {
    //     var data = $.parseJSON(jqXHR.responseText) || {};
    //     if (jqXHR.status === 200) {
    //       if (data.message) {
    //         $responseFeedback.text(data.message);
    //       }
    //     }
    //   }
    // });
  });

})();