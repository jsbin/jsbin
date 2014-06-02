(function () {
  /*global $, $body*/
  'use strict';

  var removeToppanel = function() {
    $body.removeClass('toppanel');
  };

  var showToppanel = function() {
    if (!$body.hasClass('toppanel')) {
      $body.addClass('toppanel');
    }
  };
  
  $('.toppanel-hide').click(function(event) {
    event.preventDefault();
    removeToppanel();
  });
  $('.toppanel-logo').click(function(event) {
    event.preventDefault();
    showToppanel();
  });

}());