(function () {
  /*global $, $body*/
  'use strict';

  var removeToppanel = function() {
    $body.removeClass('toppanel');
  };

  var showToppanel = function() {
    $body.addClass('toppanel');
  };

  var goSlow = function(e) {
    $body.removeClass('toppanel-slow');
    if (e.shiftKey) {
      $body.addClass('toppanel-slow');
    }
  };
  
  $('.toppanel-hide').click(function(event) {
    event.preventDefault();
    goSlow(event);
    removeToppanel();
  });
  $('.toppanel-logo').click(function(event) {
    event.preventDefault();
    goSlow(event);
    showToppanel();
  });

}());