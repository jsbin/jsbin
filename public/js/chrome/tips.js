(function () {

  var $html = $(document.documentElement),
      $tip = $('#tip'),
      $tipContent = $('p', $tip),
      tipTimeout;

  var removeTip = function (cb) {
    $html.removeClass('showtip');
    $tip.removeClass();
    $tipContent.html('');
    $(window).resize();
    cb && setTimeout(cb, 0);
  };

  var setTip = function (data) {
    clearTimeout(tipTimeout);
    $tipContent.html(data.content);
    $tip.removeClass().addClass(data.type || 'info');
    $html.addClass('showtip');
    if (!data.autohide) return;
    tipTimeout = setTimeout(function () {
      removeTip();
    }, parseInt(data.autohide, 10) || 5 * 1000);
  };

  /**
   * Trigger a tip to be shown.
   *
   *   $document.trigger('tip', 'You have an infinite loop in your HTML.');
   *
   *    $document.trigger('tip', {
   *      type: 'error',
   *      content: 'Do you even Javascript?',
   *      autohide: 8000
   *    });
   */
  $document.on('tip', function (event, data) {
    var tipData = data;
    if (typeof data === 'string') {
      tipData = {};
      tipData.content = data;
      tipData.type = 'info';
    }
    // If the content and the type haven't changed, just set it again.
    if ($tipContent.html() === tipData.content &&
        $tip.hasClass(tipData.type)) return setTip(data);
    removeTip(function () {
      setTip(tipData);
    });
  });

  $('#tip').on('click', 'a.dismiss', function () {
    removeTip();
    return false;
  });

  // Escape
  $document.keydown(function (event) {
    if (event.which == 27) {
      removeTip();
    }
  });

}());