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

  $.getJSON('/account/assets/size', function loadassets(data) {
    updateFreeSpace(data.size);
    var html = '';
    console.log(data.objects);
    data.objects.forEach(function (object) {
      var url = 'https://jsbin-user-assets.s3.amazonaws.com/' + object.filename;
      var key = object.filename.replace(/^(.*\/)?/, '');


      html += '<a href="' + url + '" data-size="' + object.size + '" data-key="' + key + '" class="asset" target="_blank">';
//       html += '<span class="flex"></span>';
      html += '<button><img src="' + jsbin.static + '/images/close-x.png"></button>';
//       html += '<img src="' + url + '">';
      html += '<div style="background-image: url(' + url.replace(/\s/g, '%20') + '), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2P89evXfwY0wMbGxoguxjgUFKI7GsTH5m4M3w1ChQAneyesWb250wAAAABJRU5ErkJggg==)"></div>';
      html += '<p class="name">' + key + '</p>';
      html += '<p class="file-size">' + object.human + '</p>';
      html += '</a>';

      /*
      html += '<li data-size="' + object.size + '" data-key="' + object.filename.replace(/^(.*\/)?/, '') + '"><a target="_blank" href="' + url + '">';
      html += '<div style="background-image: url(' + url.replace(/\s/g, '%20') + '), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2P89evXfwY0wMbGxoguxjgUFKI7GsTH5m4M3w1ChQAneyesWb250wAAAABJRU5ErkJggg==)"></div>';
      html += '<span class="filename">' + object.filename.replace(/^(.*\/)?/, '') + '</span></a> <span class="size">' + object.human + '</span> <button>x</button>';
      */
    });
    $('#files').append(html);
  });

})();