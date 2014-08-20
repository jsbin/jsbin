(function(){
  'use strict';

  /* globals $ */

  $('#flag-bin').submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var url = form.find('input[name=bin]').val();
    var $csrf = form.find('input[name=_csrf]');
    var $responseFeedback = form.find('.responseFeedback');
    var reg = /(?:https*:\/\/jsbin.com\/)*([\w]+)\/*(\d+)*/i;
    // var reg = new RegExp();
    var match = url.match(reg);
    var bin = match[1] || '';
    var rev = match[2] || 0;

    // console.log(url, bin, rev);

    $responseFeedback.show().text('Checking...');

    $.ajax({
      url: form.attr('action'),
      data: {
        bin: bin,
        rev: rev,
        _csrf: $csrf.val()
      },
      type: 'POST',
      dataType: 'json',
      complete: function (jqXHR) {
        var data = $.parseJSON(jqXHR.responseText) || {};
        if (jqXHR.status === 200) {
          $responseFeedback.show().text('Bin flagged succesfully');
        }
      }
    });
  });


  $('#flag-user').submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var username = form.find('input[name=username]').val();
    var $csrf = form.find('input[name=_csrf]');
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