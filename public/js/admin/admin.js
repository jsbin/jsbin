(function(){
  'use strict';

  /* globals $ */

  $('#flag-bin').submit(function (event) {
    event.preventDefault();

    var form = $(this);
    var url = form.find('input[name=bin]').val();
    var $csrf = form.find('input[name=_csrf]');
    var $responseFeedback = form.find('.responseFeedback');
    var reg = new RegExp('(?:https*:\\/\\/' + window.host + '\\/)*([\\w\\d-_]+)\\/*(\\d+)*\\/*.*', 'i');
    var match = url.match(reg);
    var bin = match[1] || '';
    var rev = match[2] || 'latest';

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
        if (jqXHR.status === 400 && data.all) {
          $responseFeedback.show().text(data.all);
        }
      }
    });
  });


  $('#flag-user, #validate-user').submit(function (event) {
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
          $responseFeedback.show().text('Update succesful');
        }
        if (jqXHR.status === 400 && data.all) {
          $responseFeedback.show().text(data.all);
        }
      }
    });
  });

})();