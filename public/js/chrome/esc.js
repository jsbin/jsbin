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
  } else if (keyboardHelpVisible) {
    $body.removeClass('keyboardHelp');
    keyboardHelpVisible = false;
  } else if (dropdownOpen) {
    $('.menu.open').removeClass('open');
    dropdownOpen = false;
  } else if (loginVisible) {
    $('#login').hide();
    loginVisible = false;
  } 
}

$document.delegate('.modal', 'click', function (event) {
  if ($(event.target).is('.modal')) {
    hideOpen();
  }
});