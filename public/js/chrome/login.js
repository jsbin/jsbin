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
  // Cache initial GET request
  cachedHtml[window.location.href] = $('#body').html();

  function pushState (url) {
    console.log('state pushed');
    window.history.pushState(null, null, url);
  }

  function renderNewHtml (url, htmlData) {
    var $htmlData = $(htmlData);
    if (!cachedHtml[url]) {
      cachedHtml[url] = $htmlData;
    }
    // Fill our content container with new stuff
    var content = $htmlData.siblings('.form-container').html();
    $formContainer.html(content);
    // Reattach event handlers as we have partially new DOM
    attachTabClickHandlers();
  }

  function handlePopstateChanges() {
    console.log(window.location.href);
    var url = window.location.href;
    renderNewHtml(url, cachedHtml[url]);
  }

  function attachTabClickHandlers() {

    $('.tab').click(function (event) {
      event.preventDefault();
      var url = event.target.href;

      // Don't bother loading content we already have
      if (url === window.location.href) {
        console.log("the same");
        return;
      }
      // If we've already downloaded this html, use that
      var cachedHtmlData = cachedHtml[url];
      if (cachedHtmlData) {
        renderNewHtml(url, cachedHtmlData);
        return pushState(url);
      }

      // Otherwise load it from the server
      $.ajax({
        url: url,
        success: renderNewHtml.bind(null, url),
        complete: pushState.bind(null, url)
      });

    });
  }

  // Kick it all off with initial event handlers
  attachTabClickHandlers();
  window.addEventListener('popstate', handlePopstateChanges);
}());
