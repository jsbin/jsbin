var updateTransfer = (function () {
  var $transfers = $('a.transfer').on('click', function (event) {
    event.preventDefault();
    var to = prompt('Enter the username to transfer this bin to');
    to = (to || '').trim().toLowerCase();

    if (to.length) {
      $.ajax({
        url: jsbin.getURL({ withRevision: true }) + '/transfer',
        method: 'post',
        data: {
          to: to,
          _csrf: jsbin.state.token,
        },
        success: function () {
          window.location.reload();
        },
        error: function (e) {
          console.log(e);
          if (e.status === 403) {
            alert('This bin cannot be transferred as you do not own it.');
          } else if (e.status === 400) {
            alert('The user "' + to + '" couldn\'t be found, sorry.');
          } else {
            alert('Failed to transfer bin');
          }
        }
      });
    }

  });

  var updateTransfer = function () {
    if (jsbin.owner()) {
      $transfers.show();
    } else {
      $transfers.hide();
    }
  }

  updateTransfer();

  return updateTransfer;
})();