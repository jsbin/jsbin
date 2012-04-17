(function () {
  
  var $revert = $('#revert');
  $('#download').click(function (event) {
    event.preventDefault();

    // saveCode is via save.js
    if ($revert.is(':not(.enable)') || $revert.is(':hidden') || window.location.pathname.indexOf('/edit') === -1) {
      // not edited, so don't change the version and save
      saveCode('download');
    } else {
      saveCode('save', true, function () {
        saveCode('download');
      }); // triggers via ajax
    }
  });
  
  
})();