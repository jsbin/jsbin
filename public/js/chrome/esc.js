var loginVisible = false,
    dropdownOpen = false,
    keyboardHelpVisible = false,
    urlHelpVisible = false;

$document.keydown(function (event) {
  if (event.which == 27) {//} || (keyboardHelpVisible && event.which == 191 && event.shiftKey && event.metaKey)) {
    hideOpen();
  }
});

function hideOpen() {
  if (urlHelpVisible) {
    $body.removeClass('urlHelp');
    urlHelpVisible = false;
    analytics.closeMenu('help');
  } else if (keyboardHelpVisible) {
    $body.removeClass('keyboardHelp');
    keyboardHelpVisible = false;
    analytics.closeMenu('keyboardHelp');
  } else if (dropdownOpen) {
    closedropdown();
  } else if (loginVisible) {
    $('#login').hide();
    analytics.closeMenu('login');
    loginVisible = false;
  }
}

$document.delegate('.modal', 'click', function (event) {
  if ($(event.target).is('.modal')) {
    hideOpen();
  }
});