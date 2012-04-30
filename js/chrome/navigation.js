//= require "../chrome/esc"

var $startingpoint = $('#startingpoint').click(function (event) {
  event.preventDefault();
  if (localStorage) {
    analytics.saveTemplate();
    localStorage.setItem('saved-javascript', editors.javascript.getCode());
    localStorage.setItem('saved-html', editors.html.getCode());
    $startingpoint.addClass('saved');
    $('#tip p').html('Default starting point now changed to current code');
    $html.addClass('showtip');
  }
  return false;
});

var $revert = $('#revert').click(function () {
  if ($revert.is(':not(.enable)')) {
    return false;
  }

  var key = '', i = 0;
  for (; i < sessionStorage.length; i++) {
    key = sessionStorage.key(i);
    if (key.indexOf('jsbin.content.') === 0) {
      sessionStorage.removeItem(key);
    }
  }

  for (key in editors) {
    editors[key].populateEditor();
  }

  analytics.revert();

  // editors.javascript.focus();
  $('#library').val('none');
  
  if (window.gist != undefined) {
    gist.setCode();
  }

  $document.trigger('codeChange', [ { revert: true } ]);

  return false;
});

$('#loginbtn').click(function () {
  analytics.login();
  $('#login').show();
  loginVisible = true;
  $username.focus();
  return false;
});

$('#logout').click(function (event) {
  analytics.logout();
  delete jsbin.settings.home;
  // delete cookie
  var date = new Date();
  date.setYear(1978);
  date.setTime(date.getTime()+(365*24*60*60*1000)); // set for a year
  document.cookie = 'key=""; expires=' + date.toGMTString() + '; path=/';
  document.cookie = 'home=""; expires=' + date.toGMTString() + '; path=/';

  window.location.reload();
  return false;
});

$('.homebtn').click(function () {
  analytics.open();
  jsbin.panels.hideAll();
  return false;
});

var dropdownOpen = false,
    onhover = false;

function opendropdown(el) {
  if (!dropdownOpen) {
    $(el).closest('.menu').addClass('open');
    dropdownOpen = true;
  }
}

function closedropdown() {
  if (dropdownOpen) {
    dropdownButtons.closest('.menu').removeClass('open');
    dropdownOpen = false;
    onhover = false;
  }
}

var dropdownButtons = $('.button-dropdown').click(function (e) {
  if (!dropdownOpen) {
    opendropdown(this);
  } else {
    closedropdown();
  }
  e.preventDefault();
})

$('.menu').has('.dropdown.hover').hover(function (event) {
  console.log(event.target)
  if ($(event.target).is('.button-dropdown')) {
    opendropdown(this);
    onhover = true;
  }
}, function (event) {
  console.log('hover out');
  if ($(event.currentTarget).closest('.menu').length && onhover && dropdownOpen) {
    closedropdown();
  }
});

$('#actionmenu').click(function () {
  dropdownOpen = true;
})

$body.click(function (event) {
  if (dropdownOpen) {
    if (!$(event.target).closest('.menu').length) {
      closedropdown();
      return false;
    }
  }
});

$('.dropdownmenu a').click(function () {
  closedropdown();
});

$('#download').click(function () {
  analytics.download();
});

$('#runwithalerts').click(function () {
  renderLivePreview(true);
  return false;
});

$('#runconsole').click(function () {
  editors.console.render();
  return false;
});

$('#createnew').click(function () {
  var i, key;
  analytics.createNew();
  // FIXME this is out and out [cr]lazy....
  jsbin.panels.savecontent = function(){};
  for (i = 0; i < sessionStorage.length; i++) {
    key = sessionStorage.key(i);
    if (key.indexOf('jsbin.content.') === 0) {
      sessionStorage.removeItem(key);
    }
  }
 
  jsbin.panels.saveOnExit = true;

  // first try to restore their default panels
  jsbin.panels.restore();

  // if nothing was shown, show html & live
  setTimeout(function () {
    if (jsbin.panels.getVisible().length === 0) {
      jsbin.panels.panels.html.show();
      jsbin.panels.panels.live.show();
    }
  }, 0)
});

jsbin.settings.includejs = jsbin.settings.includejs || false;
$('#enablejs').change(function () {
  jsbin.settings.includejs = this.checked;
  analytics.enableLiveJS(jsbin.settings.includejs);
  editors.live.render();
}).attr('checked', jsbin.settings.includejs);

if (jsbin.settings.hideheader) {
  $body.addClass('hideheader');
}

// add navigation to insert meta data



















