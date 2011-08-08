$(document).keydown(function (event) {
  if (event.which == 27 || (keyboardHelpVisible && event.which == 191 && event.shiftKey && event.metaKey)) {
    if (keyboardHelpVisible) {
      $body.toggleClass('keyboardHelp');
      keyboardHelpVisible = false;
    } else if (prefsOpen) {
      $body.toggleClass('prefsOpen');
      prefsOpen = false;
    }
  }
});