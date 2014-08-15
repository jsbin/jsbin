(function(){
  'use strict';

  /* globals $ */

  $('#flag-bin').submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var url = form.find('input[name=bin]').val();
    var $responseFeedback = form.find('.responseFeedback');
    var bin;
    var revision;

    console.log(url);

    // $responseFeedback.show().text('Checking...');

    // $.ajax({
    //   url: form.attr('action'),
    //   data: {
    //     bin: bin,
    //     revision: revision
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