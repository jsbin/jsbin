/* globals $ */
(function () {
  'use strict';
  // If browser doesn't support HTML5 History API
  // We just let the anchor tag do its work
  if (!window.history || !window.history.pushState) {
    return;
  }
  
  // Cache refrence to the content container
  var $body = $('#body');

  function attachTabClickHandlers() {

    $('.tab').click(function (event) {
      event.preventDefault();
      var url = event.target.href;

      // Don't bother loading content we already have
      if (url === window.location.href) {
        return;
      }

      $.ajax({
        url: url,
        success: function(htmlData) {
          // Fill our content containe with new stuff
          $body.html(htmlData);
          // Reattach event handlers as we have partially new DOM
          attachTabClickHandlers();
          // Add to history
          window.history.pushState(null, null, url);
        }
      });
    });
  }
  // Kick it all off with initial event handlers
  attachTabClickHandlers();
}());
