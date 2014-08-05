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
  $formLogin = $('#form-login');
  $('#btn-login').on('click', function(event) {
    event.preventDefault();
    $formLogin.toggle();
  });

  // Show login/registration
  $formLoginTabs = $formLogin.find('.tabs');
  $formLoginTab = $formLogin.find('a.tab');
  $formLoginTab.on('click', function(event) {
    event.preventDefault();
    var $this = $(this);
    if ($this.hasClass('login')) {
      $formLogin.addClass('login');
      $formLogin.removeClass('register');
    } else {
      $formLogin.addClass('register');
      $formLogin.removeClass('login');
    }
  })
}());
