(function () {
  /*global $*/
  'use strict';
  var images = ['jpeg', 'jpe', 'jpg', 'gif', 'svg', 'png'];

  $.getJSON('/account/assets-size', function (data) {
    $('#total-size').html(data.human);

    var html = '';
    console.log(data.objects);
    data.objects.forEach(function (object) {
      var url = 'https://jsbin-user-assets.s3.amazonaws.com/' + object.filename;
      var ext = object.filename.slice(object.filename.lastIndexOf('.') + 1);
      html += '<li><a target="_blank" href="' + url + '">';

      html += '<div style="background-image: url(' + url + '), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2P89evXfwY0wMbGxoguxjgUFKI7GsTH5m4M3w1ChQAneyesWb250wAAAABJRU5ErkJggg==)"></div>';

      html += '<span class="filename">' + object.filename.replace(/^(.*\/)?/, '') + '</span></a> <span class="size">' + object.human + '</span> <button>x</button>';
    });
    $('#files').append(html);
  });

})();