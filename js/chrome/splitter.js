$.fn.splitter = function () {
  var $document = $(document),
      $blocker = $('<div class="block"></div>');
      // blockiframe = $blocker.find('iframe')[0];
      
  var splitterSettings = JSON.parse(localStorage.getItem('splitterSettings') || '[]');
  return this.each(function () {
    var $el = $(this), 
        guid = $.fn.splitter.guid++,
        $parent = $el.parent(),
        $prev = $el.prev(),
        $handle = $('<div class="resize"></div>'),
        dragging = false,
        width = $parent.width(),
        left = $parent.offset().left,
        refreshTimer = null,
        settings = splitterSettings[guid] || {};
      
    function moveSplitter(posX) {
      var x = posX - left,
          split = 100 / width * x;

      if (split > 10 && split < 90) {
        $el.css('left', split + '%');
        $prev.css('right', (100 - split) + '%');
        $handle.css({
          left: split + '%'
        });
        settings.x = posX;
        splitterSettings[guid] = settings;
        localStorage.setItem('splitterSettings', JSON.stringify(splitterSettings));
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(function () {
          // refresh the editors left and right
          editors.javascript.refresh();
          editors.html.refresh();
        }, 100);
      }
    }

    $document.bind('mouseup touchend', function () {
      dragging = false;
      $blocker.remove();
      $handle.css('opacity', '0');
    }).bind('mousemove touchmove', function (event) {
      if (dragging) {
        moveSplitter(event.pageX || event.originalEvent.touches[0].pageX);
      }
    });
    
    $blocker.bind('mousemove touchmove', function (event) {
      if (dragging) {
        moveSplitter(event.pageX || event.originalEvent.touches[0].pageX);
      }
    });
    
    $handle.bind('mousedown touchstart', function (e) {
      dragging = true;
      $('body').append($blocker);
      
      // blockiframe.contentDocument.write('<title></title><p></p>');
      
      // TODO layer on div to block iframes from stealing focus
      width = $parent.width();
      left = $parent.offset().left;
      e.preventDefault();
    }).hover(function () {
      $handle.css('opacity', '1');
    }, function () {
      if (!dragging) {
        $handle.css('opacity', '0');
      }
    });
    
    $handle.bind('init', function (event, x) {
      $handle.css({
        top: 0,
        // left: (100 / width * $el.offset().left) + '%',
        bottom: 0,
        width: 4,
        opacity: 0,
        position: 'absolute',
        'border-left': '1px solid rgba(218, 218, 218, 0.5)',
        'z-index': 99999
      });
      
      if ($el.is(':hidden')) {
        $handle.hide();
      } else {
        moveSplitter(x || $el.offset().left);
      }
    }); //.trigger('init', settings.x || $el.offset().left);

    $prev.css('width', 'auto');
    $el.data('splitter', $handle);
    $el.before($handle);
  });
};

$.fn.splitter.guid = 0;
