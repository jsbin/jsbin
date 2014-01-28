/* globals $ */
(function (window) {
  'use strict';

  var pushState = window.history.pushState ? function (url) {
    console.log('pushstate')
    window.history.pushState(null, null, url);
  } : false;

  var $forms = $('form');

  function currentForm () {
    return this.pathname === window.location.pathname;
  }

  function handlePopstateChanges() {
    $tabs.filter(currentForm).trigger('click', [true]); 
  }

  function matchActionAttrTo (path) {
    return function(){
      return $(this).attr('action') === path;
    };
  }

  var $tabs = $('.tab').click(function (event, fromPopstate) {
    var path = event.target.pathname;

    $forms
      .hide()
      .filter(matchActionAttrTo(path)) // One element now ↓
      .show();

    // fromPopstate is true when we call click in handlePopstateChanges
    // If a user navigated back, to register, it would then set pushState
    // to register, leaving teh user stuck on that page.
    if (!fromPopstate && pushState) { 
      event.preventDefault(); 
      pushState(path);
    }

    $tabs
      .removeClass('tab-selected')
      .filter(currentForm)
      .addClass('tab-selected');

  });  
  // Kick it all off with initial event handlers

  window.addEventListener('popstate', handlePopstateChanges);
  handlePopstateChanges();

}(window));
