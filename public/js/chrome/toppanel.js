(function () {
  /*global jsbin, $, $body*/
  'use strict';

  if (jsbin.settings.gui === undefined) {
    jsbin.settings.gui = {};
  }
  if (jsbin.settings.gui.toppanel === undefined) {
    jsbin.settings.gui.toppanel = true;
  }

  $body.toggleClass('toppanel', jsbin.settings.gui.toppanel);

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
    jsbin.settings.gui.toppanel = false;
    removeToppanel();
  });
  $('.toppanel-logo').click(function(event) {
    event.preventDefault();
    goSlow(event);
    jsbin.settings.gui.toppanel = true;
    showToppanel();
  });

}());