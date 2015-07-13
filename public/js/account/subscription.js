(function () {
  $('#cancel').on('submit', function (event) {
    var result = prompt("Enter your username to confirm the cancellation\n(it's \"{{../../username}}\" by the way).\n\nWe'll miss you :(");
    if (!result || (result.toLowerCase().trim() !== '{{../../username}}'.toLowerCase())) {
      event.preventDefault();
    }
  });

  // Expiry is a single field, so we need to split it up to validate
  var expiry = $('#expiry').payment('formatCardExpiry').on('blur input', function () {
    var data = this.value.split('/').map(function (s) {
      return s.trim();
    });

    $(this).closest('span').toggleClass('valid', $.payment.validateCardExpiry(data[0], data[1]));
  }).blur();

  var $form = $('#update-card').on('submit', function (event) {
    event.preventDefault();

    var btn = $form.find('button').prop('disabled', true);
    $.ajax({
      url: this.getAttribute('action'),
      method: 'post',
      type: 'json',
      data: $form.serialize(),
      complete: function () {
        btn.prop('disabled', false);
      },
      success: function () {
        alert('Successfully updated card details');
      },
      error: function (res) {
        alert(res.responseJSON.error);
      }
    });
  });
})();