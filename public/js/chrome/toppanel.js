(function () {
  /*global $, $body*/
  'use strict';
  
  $('.toppanel-hide').click(function(event) {
    event.preventDefault();
    $body.removeClass('toppanel');
  });

}());