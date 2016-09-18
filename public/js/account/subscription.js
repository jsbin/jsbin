(function () {
  /* global $, Stripe */
  /**
   * Make the form friendly for credit card input
   */
  var cardnumber = $('#cardnumber').payment('formatCardNumber').on('blur input', function () {
    $(this).closest('span').toggleClass('valid', $.payment.validateCardNumber(this.value));
  });

  // Expiry is a single field, so we need to split it up to validate
  var expiry = $('#expiry').payment('formatCardExpiry').on('blur input', function () {
    var data = this.value.split('/').map(function (s) {
      return s.trim();
    });

    $(this).closest('span').toggleClass('valid', $.payment.validateCardExpiry(data[0], data[1]));
  });

  // CVC
  var cvc = $('#cvc').payment('formatCardCVC').on('blur input', function () {
    var card = $.payment.cardType(cardnumber.val());
    $(this).closest('span').toggleClass('valid', $.payment.validateCardCVC(this.value, card));
  });

  // Expiry is a single field, so we need to split it up to validate
  var expiry = $('#expiry').payment('formatCardExpiry').on('blur input', function () {
    var data = this.value.split('/').map(function (s) {
      return s.trim();
    });

    $(this).closest('span').toggleClass('valid', $.payment.validateCardExpiry(data[0], data[1]));
  }).blur();

  var updateCardBtn = $('#update-card-btn');
  var $form = $('#update-card').on('submit', function (event) {
    event.preventDefault();

    updateCardBtn.prop('disabled', true);

    var expiryData = $('#expiry').val().split('/').map(function (s) {
      return s.trim();
    });

    // create a new card token and update everything
    Stripe.card.createToken({
      number: $('#cardnumber').val(),
      cvc: $('#cvc').val(),
      exp_month: expiryData[0],
      exp_year: expiryData[1]
    }, stripeResponseHandler);
  });

  function stripeResponseHandler(status, response) {
    if (response.error) {
      // Show the errors on the form
      alert(response.error.message);
      $form.find('button').prop('disabled', false);
    } else {
      // and submit
      $.ajax({
        url: $form.attr('action'),
        method: 'post',
        type: 'json',
        data: {
          stripeToken: response.id,
          _csrf: $('input[name="_csrf"]').val(),
        },
        complete: function () {
          updateCardBtn.prop('disabled', false);
        },
        success: function () {
          alert('Successfully updated card details');
        },
        error: function (res) {
          alert(res.responseJSON.error);
        },
      });
    }
  }
})();
