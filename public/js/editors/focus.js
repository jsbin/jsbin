(function () {
  'use strict';

  var esc = 27;
  var tab = 9;
  var f9 = 120;
  var up = 38;
  var down = 40;

  function insertTab(event) {
    var el = event.target;
    var start = el.selectionStart;
    var end = el.selectionEnd;

    var target = el;
    var value = target.value;

    // set textarea value to: text before caret + tab + text after caret
    target.value = value.substring(0, start) + '\t' + value.substring(end);

    // put caret at right position again (add one for the tab)
    el.selectionStart = el.selectionEnd = start + 1;
  }

  $('.panel').on('keydown', 'textarea', function (event) {
    var which = event.which;
    // if (which === esc) {
    //   $(this).closest('.panel').focus();
    //   return false;
    // }

    if (jsbin.lameEditor && which === tab) {
      insertTab(event);
      return false;
    }

    if (which === f9) {
      $('#panels a:first').focus();
      return false;
    }
  });

  var oldFocusPanel = null;
  $('.menu').on('open', function () {
    // enable tab focus when menu is opened
    oldFocusPanel = document.activeElement;
    $(this).find('.dropdown a').attr('tabindex', 0).filter(':first').focus();
  }).on('close', function () {
    // and disable (tabindex=-1) when closed
    $(this).find('.dropdown a').attr('tabindex', -1);
    if (oldFocusPanel) {
      oldFocusPanel.focus();
    }
  }).trigger('close').on('keydown', function (event) {
    var which = event.which;

    if (which === up) {
      var $focused = $(document.activeElement).removeClass('hover');
      var $links = $focused.prevAll('a:visible');
      $links.eq(0).focus().addClass('hover');
    } else if (which === down) {
      var $focused = $(document.activeElement).removeClass('hover');
      var $links = $focused.nextAll('a:visible');
      $links.eq(0).focus().addClass('hover');
    }
  });

  var $toppanel = $('#toppanel').on('open', function () {
    $toppanel.find('a').attr('tabindex', 0);
  }).on('close', function () {
    $toppanel.find('a').filter(function () {
      return this.className !== 'toppanel-logo';
    }).attr('tabindex', -1);
  });

  if (true) { // debug information
    var $active = $('<pre></pre>').css({
      position: 'absolute',
      right: 20,
      bottom: 20,
      margin: 0,
      zIndex: 10000,
      fontSize: 12,
      padding: 5,
      color: '#fff',
      borderRadius: 3,
      background: '#aaa',
      overflow: 'hidden',
      maxWidth: '95%',
      textOverflow: 'ellipsis',
    }).attr('tabindex', -1).appendTo('body').focus(function () {
      $active.css({
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
      });
    }).blur(function () {
      $active.css({
        overflow: 'hidden',
        whiteSpace: 'pre',
      });
    });

    var lastActive = null;

    var showActive = function () {
      var el = document.activeElement;
      var html;
      var attrs;
      var i = 0;

      if (el !== lastActive && el !== $active[0]) {
        lastActive = el;
        html = '<' + el.nodeName.toLowerCase();
        attrs = el.attributes;

        for (i = 0; i < attrs.length; i++) {
          html += ' ' + attrs[i].name + '="' + attrs[i].value + '"';
        }

        html += '>';

        $active.text(html);
      }

      requestAnimationFrame(showActive);
    }

    showActive();
  }

  if ($('body').hasClass('toppanel')) {
    $toppanel.trigger('open');
  } else {
    $toppanel.trigger('close');
  }

})();