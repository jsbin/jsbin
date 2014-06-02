(function () {
  /*global $, $body*/
  'use strict';

  var removeToppanel = function() {
  	$body.removeClass('toppanel');
  };
  
  $('.toppanel-hide').click(function(event) {
    event.preventDefault();
    removeToppanel();
  });

  // Escape
  $document.keydown(function (event) {
    if (event.which == 27) {
      removeToppanel();
    }
  });

}());