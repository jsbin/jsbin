var $startingpoint = $('#startingpoint').click(function (event) {
  event.preventDefault();
  if (localStorage) {
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
  
  sessionStorage.removeItem('javascript');
  sessionStorage.removeItem('html');

  populateEditor('javascript');
  populateEditor('html');

  editors.javascript.focus();
  $('#library').val('none');
  
  if (window.gist != undefined) {
    gist.setCode();
  }

  $document.trigger('codeChange', [ true ]);

  return false;
});

$('#loginbtn').click(function () {
  $('#login').show();
  loginVisible = true;
  $username.focus();
});

$('#homebtn').click(function () {
  jsbin.panels.hideAll();
});

//= require "../chrome/esc"

var prefsOpen = false;

$('.prefsButton a').click(function (e) {
  prefsOpen = true;
  e.preventDefault();
  $body.toggleClass('prefsOpen');
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

$('.menu').has('.dropdown').hover(function () {
  opendropdown(this);
  onhover = true;
}, function (event) {
  console.log('hover out');
  if ($(event.currentTarget).closest('.menu').length && onhover && dropdownOpen) {
    closedropdown();
  }
});

$body.click(function (event) {
  if (dropdownOpen) {
    if (!$(event.target).closest('.menu').length) {
      closedropdown();
      return false;
    }
  }
});

$('#runwithalerts').click(function () {
  renderLivePreview(true);
});

editors.live.disablejs = jsbin.settings.disablejs || true;
$('#enablejs').change(function () {
  jsbin.settings.disablejs = editors.live.disablejs = !this.checked;
  editors.live.render();
}).attr('checked', editors.live.disablejs ? false : true);

