$.fn.splitter = function () {
  var $blocker = $('<div class="block"></div>'),
      splitterSettings = JSON.parse(localStorage.getItem('splitterSettings') || '[ { "x" : null }, { "x" : null } ]');

  // fixed by @firejune
  return this.each(function () {
    var $el = $(this)
        guid = $.fn.splitter.guid++,
        $parent = $el.parent(),
        $prev = $el.prevAll(),
        $next = $el.nextAll(),
        $handle = $('<div class="resize"></div>'),
        dragging = false,
        width = $parent.width(),
        left = $parent.offset().left,
        settings = splitterSettings[guid] || {};

    function moveSplitter(posX, init) {
      var x = posX - left,
          split = init ? posX : 100 / width * x,
          next = $next.filter(':visible'),
          prev = $prev.filter(':visible').first();

      if (split > (parseInt(prev.css('left')) || 0) + 10 && split < (parseInt(next.css('left')) || 100) - 10) {
        $el.css('left', split + '%').data('style', {left: split});
        prev.css('right', (100 - split) + '%');
        $handle.css({left: split + '%'});
        settings.x = split;
        splitterSettings[guid] = settings;

        localStorage.setItem('splitterSettings', JSON.stringify(splitterSettings));
      }
    }

    $document.bind('mouseup touchend', function () {
      dragging = false;
      $blocker.remove();
      $handle.css('opacity', '0');
    }).bind('mousemove touchmove', function (event) {
      dragging && moveSplitter(event.pageX || event.originalEvent.touches[0].pageX);
    });
    
    $blocker.bind('mousemove touchmove', function (event) {
      dragging && moveSplitter(event.pageX || event.originalEvent.touches[0].pageX);
    });

    $handle.bind('mousedown touchstart', function (e) {
      dragging = true;
      $body.append($blocker);

      // blockiframe.contentDocument.write('<title></title><p></p>');
      // TODO layer on div to block iframes from stealing focus
      width = $parent.width();
      left = $parent.offset().left;
      e.preventDefault();
    }).hover(function () {
      $handle.css('opacity', '1');
    }, function () {
      !dragging && $handle.css('opacity', '0');
    });

    $handle.bind('init', function (event, x) {
      $handle.css({
        // left: (100 / width * $el.offset().left) + '%',
        opacity: 0
      });

      if ($el.is(':hidden')) {
        $handle.hide();
      } else {
        moveSplitter(x || $el.offset().left, true);
      }

    }).trigger('init', settings.x || $el.offset().left);

    $prev.css('width', 'auto');
    $el.data('splitter', $handle);
    $el.before($handle);
  });
};

$.fn.splitter.guid = 0;