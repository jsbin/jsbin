var $html = $(document.documentElement);

$('#tip a.dismiss').click(function () {
  $html.removeClass('showtip');
  $(window).resize();
  sessionStorage.setItem('tips', 'false');
  return false;
});

var showTips = sessionStorage.getItem('tips');
if (showTips === null) {
  // $html.addClass('showtip'); 
}

// remove this setting after a few days (or a new set of tips come in)