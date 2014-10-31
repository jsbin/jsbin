(function () {
  /*global $, fileSize*/
  'use strict';
  var csrf = $('#_csrf').val();
  var totalSize = 0;

  function readableFileSize(size) {
    var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = 0;
    while(size >= 1024) {
        size /= 1024;
        ++i;
    }

    if ((size | 0) === size) {
      return size + ' ' + units[i];
    }

    return size.toFixed(1) + ' ' + units[i];
  }

  $('#files').on('click', 'button', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var $button = $(this).prop('disabled', true);
    $.post('/account/assets/remove', {
      _csrf: csrf,
      key: $button.closest('a').data('key')
    }, function () {
      var $li = $button.closest('a');
      var size = $li.data('size') * 1;
      totalSize -= size;
      updateFreeSpace(totalSize);
      $li.fadeTo(200, 0, function () {
        $li.remove();
      });
    });
  });

  function updateFreeSpace(size) {
    var percent = (size / (1024 * 1024 * 1024)) * 100;
    if ((percent | 0 ) !== percent) {
      percent = percent.toFixed(1);
    }
    $('#total-size').html(readableFileSize(size) + ' used ' + percent + '% of your current 1 GB limit');
    totalSize = size;
  }

  var root = document.documentElement;

  root.ondragover = function () {
    return false;
  };

  root.ondragend = function () {
    return false;
  };

  root.ondrop = function (e) {
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    uploadAsset(file);
  };

  function uploadAsset(file) {
    var currentStatus = 0;
    var $status = $('#total-size');
    var old = $status.html();

    var reset = function () {
      $status.html(old);
    }

    var progress = function progress(percent, status) {
      if (percent - currentStatus < 10) {
        currentStatus = percent;
      } else {
        currentStatus += 10;
        requestAnimationFrame(function () {
          progress(percent, status);
        });
      }

      if (currentStatus > 0) {
        if (currentStatus > 97) {
          $status.html('97% uploaded...');
          // because there's some lag between 100% and actually rendering
        } else {
          $status.html(currentStatus + '% uploaded...');
        }
      }
    };

    $status.html('Uploading ...');

    var size = file.size;

    var filename = file.name.replace(/\s+/g, '-');

    var s3upload = new S3Upload({
      s3_sign_put_url: '/account/assets/sign',
      s3_object_name: filename,
      files: [file],

      onProgress: function (percent, status) {
        requestAnimationFrame(function () {
          progress(percent, status);
        });
      },

      onError: function (reason, fromServer) {
        currentStatus = -1;
        console.error('Failed to upload: ' + fromServer);
        $status.html(fromServer || 'Failed to complete');
        panel = null;
        cursorPosition = null;
        if (widget) {
          setTimeout(function () {
            reset();
          }, 4000);
        }
      },

      onFinishS3Put: function (url) {
        $('#files').append(addImage({
          filename: filename,
          size: size,
          human: readableFileSize(size)
        }));
        reset();
      }
    });
  }

  function getFileData(item) {
    return new Promise(function (resolve, reject) {
      if (item.kind === 'string') {
        item.getAsString(function (filename) {
          resolve(filename);
        });
      } else {
        resolve(item.getAsFile());
      }
    });
  }

  function addImage(object) {
    var images = ['png', 'jpg', 'peg', 'gif'];
    var url = 'https://jsbin-user-assets.s3.amazonaws.com/' + object.filename;
    var bg = url;
    var ext = url.slice(-3);
    var key = object.filename.replace(/^(.*\/)?/, '');
    var html = '';

    if (images.indexOf(ext) === -1) {
      bg = jsbin.static + '/images/document.svg';
    }

    html += '<a href="' + url + '" data-size="' + object.size + '" data-key="' + key + '" class="asset" target="_blank">';
    html += '<button><img src="' + jsbin.static + '/images/close-x.png"></button>';
    html += '<div style="background-image: url(' + bg.replace(/\s/g, '%20') + '), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2P89evXfwY0wMbGxoguxjgUFKI7GsTH5m4M3w1ChQAneyesWb250wAAAABJRU5ErkJggg==)"></div>';
    html += '<p class="name">' + key + '</p>';
    html += '<p class="file-size">' + object.human + '</p>';
    html += '</a>';
    return html;
  }

  function getLatestSizes() {
    $.getJSON('/account/assets/size', function loadassets(data) {
      updateFreeSpace(data.size);
      var html = '';
      data.objects.forEach(function (object) {
        html += addImage(object);
      });
      $('#files').append(html);
    });
  }

  getLatestSizes();
})();