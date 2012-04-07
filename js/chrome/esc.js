var loginVisible = false,
    dropdownOpen = false,
    keyboardHelpVisible = false;
$document.keydown(function (event) {
  if (event.which == 27 || (keyboardHelpVisible && event.which == 191 && event.shiftKey && event.metaKey)) {
    if (keyboardHelpVisible) {
      $body.toggleClass('keyboardHelp');
      keyboardHelpVisible = false;
    } else if (prefsOpen) {
      $body.toggleClass('prefsOpen');
      prefsOpen = false;
    } else if (dropdownOpen) {
      $('.menu.open').removeClass('open');
      dropdownOpen = false;
    } else if (loginVisible) {
      $('#login').hide();
      loginVisible = false;
    } else if ($('#history').length && !$body.hasClass('panelsVisible')) {
      $('#history').toggle(100);
    }
  }
});