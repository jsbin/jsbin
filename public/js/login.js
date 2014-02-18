/* globals $ */
(function (window) {
  'use strict';

  var pushState = window.history.pushState ? function (url) {
    window.history.pushState(null, null, url);
  } : false;
  var $forms = $('#login-register-page.form-container form');
  var $info = $('#login-register-page.form-container .info');
  var currentPath = null;

  function currentForm() {
    return this.pathname === window.location.pathname; // jshint ignore:line
  }

  function handlePopstateChanges() {
    $tabs.filter(currentForm).trigger('click', [true]);
  }

  function matchActionAttrTo(path) {
    return function(){
      return this.getAttribute('action').indexOf(path) !== -1;
    };
  }
  var $formcontainer = $('#login-register-page.form-container');
  var $tabs = $('#login-register-page .tab').click(function (event, fromPopstate) {
    var path = event.target.pathname || event.target.parentNode.pathname;

    // if pushState isn't supported, then follow the link through:
    // Progressive Enhancement FTW.
    if (!pushState && !fromPopstate) {
      return;
    }

    // do nothing if we're already on this tab
    if (currentPath === path) {
      return false;
    }

    currentPath = path;

    $forms
      .hide()
      .filter(matchActionAttrTo(path)) // One element now ↓
      .show();

    $info.hide();

    // fromPopstate is true when we call click in handlePopstateChanges
    // If a user navigated back, to register, it would then set pushState
    // to register, leaving teh user stuck on that page.
    if (!fromPopstate && pushState) {
      event.preventDefault();
      pushState(path);
    }

    $formcontainer
      .removeClass('register login')
      .addClass(path.slice(1));
  });
  // Kick it all off with initial event handlers

  window.addEventListener('popstate', handlePopstateChanges);
  handlePopstateChanges();

  $forms.on('submit', function(event) {
    event.preventDefault();
    var $form = $(event.target);

    var data = $form.serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {});

    $.ajax({
      url: $form.attr('action'),
      type: $form.attr('method'),
      data: data,
      dataType: 'json',
      success: function(res) {
        window.location.href = res.referrer;
      },
      error: function(res) {
        $info.show().find('p').text(res.responseJSON.message);
      }
    });

  });

}(window));
