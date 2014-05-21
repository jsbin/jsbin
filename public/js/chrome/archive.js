function archive(unarchive) {
  /*global jsbin, $, $document*/
  'use strict';
  var type = unarchive === false ? 'unarchive' : 'archive';

  if (jsbin.owner()) {
    $.ajax({
      type: 'POST',
      url: jsbin.getURL() + '/' + type,
      error: function () {
        $document.trigger('tip', {
          type: 'error',
          content: 'The ' + type + ' action failed. If this continues, please can you file an issue?'
        });
      },
      success: function () {
        $document.trigger('tip', {
          type: 'notication',
          autohide: 5000,
          content: 'This bin is now ' + type + 'd'
        });
      }
    });
  } else {
    $document.trigger('tip', {
      type: 'notication',
      content: 'The ' + type + ' action failed. You can only own'
    });
  }
}

var unarchive = archive.bind(null, false);