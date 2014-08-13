/* globals $ */
(function () {

  var $input = $('#coupon_code');
  var $form = $('#stripe_pro_month');
  var originalAction = $form.attr('action');

  $input.on('change', function () {
    'use strict';
    $form.attr('action', originalAction + '?' + $input.val());
  });

  // Show/hide email login/registration block
  var $formLogin = $('#form-login');
  $('#btn-login').on('click', function(event) {
    event.preventDefault();
    $formLogin.toggle();
    $('.upgrade-signin-wrapper').toggle();
  });

  // Show login/registration
  var $formLoginTabs = $formLogin.find('.tabs');
  var $formLoginTab = $formLogin.find('a.tab');
  var $formLoginLogin = $formLogin.find('.upgrade-fieldset.login');
  var $formLoginRegister = $formLogin.find('.upgrade-fieldset.register');
  $formLoginTab.on('click', function(event) {
    event.preventDefault();
    var $this = $(this);
    if ($this.hasClass('login')) {
      $formLogin.addClass('login');
      $formLogin.removeClass('register');
      $formLoginRegister.attr('disabled', 'disabled');
      $formLoginLogin.attr('disabled', false);
    } else {
      $formLogin.addClass('register');
      $formLogin.removeClass('login');
      $formLoginRegister.attr('disabled', false);
      $formLoginLogin.attr('disabled', 'disabled');
    }
  })

  var hasFormValidation = false;
  if (typeof document.createElement('input').checkValidity === 'function') {
    hasFormValidation = true;
  }
  // Steps
  var openClass = 'open';
  var $upgradeSummaries = $('.upgrade-summary');
  var $submit = $('#payment-form').find(':submit');

  $upgradeSummaries.on('click', function() {
    $(this).closest('.upgrade-details').toggleClass(openClass);
  });

  $upgradeSummaries.eq(0).trigger('click');

  $('.upgrade-details-next').on('click', function(event) {
    event.preventDefault();
    var sendable = true;
    if (hasFormValidation) {
      $formLogin.find('input').each(function() {
        if (!this.checkValidity()) {
          $submit.click();
          sendable = false;
          return false;
        }
      });
    }
    if (sendable) {
      $(this).closest('.upgrade-details').removeClass(openClass)
        .nextAll('.upgrade-details').addClass(openClass);
    }
  })
}());
