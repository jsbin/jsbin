/* globals $ */
(function (window) {
  'use strict';

  var pushState = window.history.pushState ? function (url) {
    window.history.pushState(null, null, url);
  } : false;

  if ( !pushState) {
    return;
  }

  var $forms = $('#login-register-page.form-container form');
  var $info = $('#login-register-page.form-container .info');
  var currentPath = null;
  var firstrun = true;

  function hideInfo() {
    return $info.removeClass('active');
  }

  function showInfo() {
    return $info.addClass('active');
  }

  function currentForm() {
    return this.pathname === window.location.pathname; // jshint ignore:line
  }

  function handlePopstateChanges() {
    $tabs.filter(currentForm).trigger('click', [true]);
  }

  function matchActionAttrTo(path) {
    return function () {
      return this.getAttribute('action').indexOf(path) !== -1;
    };
  }

  function getFormData($form) {
    return $form.serializeArray().reduce(function (obj, item) {
      var name = item.name;
      obj[name] = item.value;
      return obj;
    }, {});
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

    if (!firstrun) {
      hideInfo();
    } else {
      firstrun = false;
    }

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

    var data = getFormData($form);

    $.ajax({
      url: $form.attr('action'),
      type: $form.attr('method'),
      data: data,
      dataType: 'json',
      success: function(res) {
        window.location.href = res.referrer;
      },
      error: function(res) {
        showInfo().find('p').html(res.responseJSON.message);
      }
    });

  });

  var $loginForm = $('#login');
  $('#lostpass').click(function (event) {
    event.preventDefault();

    showInfo().find('p').text('Requesting password reset token...');

    setTimeout(function () {
      var email = $('#login-username').val();

      if (email) {
        var data = getFormData($loginForm);
        data.email = data.username;
        $.ajax({
          url: window.location.origin + '/forgot',
          type: 'post',
          data: data,
          dataType: 'json',
          success: function (data) {
            showInfo().find('p').text(data.message || data.error);
          },
          error: function (res) {
            var data = res.responseJSON;
            showInfo().find('p').text(data.error || data.message);
          }
        });
      } else {
        showInfo().find('p').text('Please enter your username or email address above, and I\'ll try to find you and send you a reset token.');
      }

    }, 1000);

    return false;
  });

}(window));
