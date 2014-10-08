(function () {
  /*global $, fileSize*/
  'use strict';
  var csrf = $('#_csrf').val();
  var totalSize = 0;

  $('#files').on('click', 'button', function () {
    var $button = $(this).prop('disabled', true);
    $.post('/account/assets/remove', {
      _csrf: csrf,
      key: $button.closest('li').data('key')
    }, function () {
      var $li = $button.closest('li');
      var size = $li.data('size') * 1;
      totalSize -= size;
      $('#total-size').html(filesize(totalSize).human());
      $li.fadeTo(200, 0, function () {
        $li.remove();
      });
    });
  });

  $.getJSON('/account/assets/size', function (data) {
    $('#total-size').html(data.human);
    totalSize = data.size;

    var html = '';
    console.log(data.objects);
    data.objects.forEach(function (object) {
      var url = 'https://jsbin-user-assets.s3.amazonaws.com/' + object.filename;
      html += '<li data-size="' + object.size + '" data-key="' + object.filename.replace(/^(.*\/)?/, '') + '"><a target="_blank" href="' + url + '">';

      html += '<div style="background-image: url(' + url.replace(/\s/g, '%20') + '), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2P89evXfwY0wMbGxoguxjgUFKI7GsTH5m4M3w1ChQAneyesWb250wAAAABJRU5ErkJggg==)"></div>';

      html += '<span class="filename">' + object.filename.replace(/^(.*\/)?/, '') + '</span></a> <span class="size">' + object.human + '</span> <button>x</button>';
    });
    $('#files').append(html);
  });

})();