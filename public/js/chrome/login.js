/* globals $ */
(function (window) {
  'use strict';

  var pushState = window.history.pushState ? function (url) {
    window.history.pushState(null, null, url);
  } : false;
  var $forms = $('.form-container form');
  var $info = $('.form-container .info'); 

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
    if (!pushState && !fromPopstate) {
      return;
    }

    var path = event.target.pathname || event.target.parentNode.pathname;

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

    $('.form-container')
      .removeClass('register login')
      .addClass($tabs.filter(currentForm)[0].classList[1]);

    $info.empty();

  });  
  // Kick it all off with initial event handlers

  window.addEventListener('popstate', handlePopstateChanges);
  handlePopstateChanges();

  $forms.on('submit', function(event) {
    event.preventDefault();
    var $form = $(event.target);

    var data = $form.serializeArray().reduce(function(obj, item) {
      return obj[item.name] = item.value, obj;
    }, {});

    $.ajax({
      url:      'https://jsbin.dev' + $form.attr('action'),
      type:     $form.attr('method'),
      data:     data,
      dataType: 'json',
      success: function(res) {
        window.location.href = res;
      },
      error: function(res) {
        $info.text(res.responseText);
      }
    });

  });

}(window));