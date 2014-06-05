(function () {
  /*global jsbin, $, $body*/
  'use strict';

  if (jsbin.settings.gui === undefined) {
    jsbin.settings.gui = {};
  }
  if (jsbin.settings.gui.toppanel === undefined) {
    jsbin.settings.gui.toppanel = true;
  }

  var removeToppanel = function() {
    $body.addClass('toppanel-close');
    $body.removeClass('toppanel');
  };

  var showToppanel = function() {
    $body.removeClass('toppanel-close');
    $body.addClass('toppanel');
  };

  // to remove
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
  $document.keydown(function (event) {
    if (event.which == 27) {
      if ($body.hasClass('toppanel')) {
        jsbin.settings.gui.toppanel = false;
        removeToppanel();
      }
    }
  });

}());