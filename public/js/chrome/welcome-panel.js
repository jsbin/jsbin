(function () {
  /*global jsbin, $, $body, $document, analytics, settings*/
  'use strict';

  if (!$('#toppanel').length) {
    return;
  }

  if (jsbin.settings.gui === undefined) {
    jsbin.settings.gui = {};
  }
  if (jsbin.settings.gui.toppanel === undefined) {
    jsbin.settings.gui.toppanel = true;
    localStorage.setItem('settings', JSON.stringify(jsbin.settings));
  }

  if ($body.hasClass('toppanel') && jsbin.settings.gui.toppanel === false) {
    $body.addClass('toppanel-close');
    $body.removeClass('toppanel');
  }

  // analytics for panel state
  analytics.welcomePanelState(jsbin.settings.gui.toppanel);

  var removeToppanel = function() {
    jsbin.settings.gui.toppanel = false;
    settings.save();
    $body.addClass('toppanel-close');
    $body.removeClass('toppanel');
  };

  var showToppanel = function() {
    jsbin.settings.gui.toppanel = true;
    settings.save();
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
    if (event.which === 27) {
      if ($body.hasClass('toppanel')) {
        removeToppanel();
      }
    }
  });

  // analytics for links
  $('#toppanel').find('.toppanel-link').mousedown(function() {
    analytics.welcomePanelLink(this.href);
  });

}());