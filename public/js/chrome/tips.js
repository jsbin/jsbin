var $html = $(document.documentElement);

$('#tip a.dismiss').click(function () {
  $html.removeClass('showtip');
  $(window).resize();
  return false;
});

window.showTip = function () {
  if (jsbin.settings.lastTip === undefined) jsbin.settings.lastTip = -1;
  if (tips) {
    for (var id = 0; id < tips.length; id++) {
      if (id > jsbin.settings.lastTip) {
        $('#tip p').html(tips[id]);
        jsbin.settings.lastTip = id;
        $html.addClass('showtip'); 
        break;
      }
    }
  }
};

// showTip();