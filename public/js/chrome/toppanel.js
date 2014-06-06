(function () {
  /*global jsbin, $, $body, $document*/
  'use strict';

  if (jsbin.settings.gui === undefined) {
    jsbin.settings.gui = {};
  }
  if (jsbin.settings.gui.toppanel === undefined) {
    jsbin.settings.gui.toppanel = true;
    localStorage.setItem('settings', JSON.stringify(jsbin.settings));
  }

  var removeToppanel = function() {
    jsbin.settings.gui.toppanel = false;
    localStorage.setItem('settings', JSON.stringify(jsbin.settings));
    $body.addClass('toppanel-close');
    $body.removeClass('toppanel');
  };

  var showToppanel = function() {
    jsbin.settings.gui.toppanel = true;
    localStorage.setItem('settings', JSON.stringify(jsbin.settings));
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
    removeToppanel();
  });
  $('.toppanel-logo').click(function(event) {
    event.preventDefault();
    goSlow(event);
    showToppanel();
  });
  $document.keydown(function (event) {
    if (event.which == 27) {
      if ($body.hasClass('toppanel')) {
        removeToppanel();
      }
    }
  });

}());