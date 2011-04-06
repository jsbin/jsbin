function enableDownload() {
  $('#save').removeClass('right gap').after('<a id="download" class="button download group right light gap" href="">Download</a>');

  var $revert = $('#revert');
  $('#download').click(function (event) {
    event.preventDefault();

    // saveCode is via save.js
    if ($revert.is(':not(.enable)') || $revert.is(':hidden') || url.indexOf('/edit') === -1) {
      // not edited, so don't change the version and save
      saveCode('download');
    } else {
      saveCode('save', true, function () {
        saveCode('download');
      }); // triggers via ajax
    }
  });
}
