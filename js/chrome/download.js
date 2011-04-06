function enableDownload() {
  $('#save').removeClass('right gap').after('<a id="download" class="button download group right light gap" href="">Download</a>');

  var $revert = $('#revert');
  $('#download').click(function (event) {
    event.preventDefault();
    var url = window.location.pathname,
        parts = [];

    // saveCode is via save.js
    if ($revert.is(':not(.enable)') || $revert.is(':hidden') || url.indexOf('/edit') === -1) {
      // not edited, so don't change the version and save
      saveCode('download');
      return;
    } else {
      saveCode('download,save');
    }

    parts = url.split('/');
    parts.pop(); // "edit"
    var revision = parts.pop();
    var code_id = parts.pop();
    if (!/\d+/.test(revision)) {
      code_id = revision;
      revision = 1;
    }

    revision++;

    url = '/' + code_id + '/' + revision;

    if (window.history && window.history.pushState) {
      window.history.pushState(null, url + '/edit', url + '/edit');

      $('form').attr('action', url + '/save');
      var link = $('#jsbinurl').attr('href', url)[0];

      if (link.href) {
        $('#jsbinurl').text(link.href);
      }
    } else {
      window.location = url + '/edit';
    }
  });
}
