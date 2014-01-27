/* globals $ */
(function () {
  'use strict';
  // If browser doesn't support HTML5 History API
  // We just let the anchor tag do its work
  if (!window.history || !window.history.pushState) {
    return;
  }
  
  // Cache refrence to the content container
  var $formContainer = $('.form-container');
  var cachedHtml = {};

  function renderNewHtml (url, htmlData) {
    cachedHtml[url] = htmlData;
    // Fill our content container with new stuff
    var content = $('<div>').html(htmlData).find('.form-container').html();
    $formContainer.html(content);
    // Reattach event handlers as we have partially new DOM
    attachTabClickHandlers();
    // Add to history
    window.history.pushState(null, null, url);
  }

  function attachTabClickHandlers() {

    $('.tab').click(function (event) {
      event.preventDefault();
      var url = event.target.href;

      // Don't bother loading content we already have
      if (url === window.location.href) {
        return;
      }
      // If we've already downloaded this html, use that
      var cachedHtmlData = cachedHtml[url];
      if (cachedHtmlData) {
        return renderNewHtml(url, cachedHtmlData);
      }

      // Otherwise load it from the server
      $.ajax({
        url: url,
        success: renderNewHtml.bind(null, url)
      });

    });
  }
  // Kick it all off with initial event handlers
  attachTabClickHandlers();
}());
