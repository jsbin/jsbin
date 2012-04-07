if ($('#history').length) (function () {
  function render(url) {
    doc.open();
    doc.write('<iframe src="' + url + 'quiet"></iframe>');
    doc.close();
    iframe.removeAttribute('hidden');
    viewing.innerHTML = window.location.hostname + url;
  }

  function matchNode(el, nodeName) {
    if (el.nodeName == nodeName) {
      return el;
    } else if (el.nodeName == 'BODY') {
      return false;
    } else {
      return matchNode(el.parentNode, nodeName);
    }
  }

  function removeHighlight() {
    var i = trs.length;
    while (i--) {
      trs[i].className = '';
    }
  }

  function visit() {
    window.location = this.getAttribute('data-url') + 'edit?live';
  }

  var preview = $('#history .preview'),
      iframe = $('#history iframe')[0];
      doc = iframe.contentDocument || iframe.contentWindow.document,
      win = doc.defaultView || doc.parentWindow,
      bins = $('#history'),
      trs = $('#history tr'),
      current = null,
      viewing = $('#history #viewing')[0],
      hoverTimer = null;

  // stop iframe load removing focus from our main window
  win.onfocus = function () {
    console.log('focus killed');
    return false;
  };

  win.onload = function () {
    console.log('load killed');
    return false;
  }

  trs.click(visit);
  // this is some nasty code - just because I couldn't be
  // bothered to bring jQuery to the party.
  bins.mouseover(function (event) {
    clearTimeout(hoverTimer);
    event = event || window.event;
    var url, target = event.target || event.srcElement;
    if (target = matchNode(event.target, 'TR')) {
      removeHighlight();
      if (target.getAttribute('data-type') !== 'spacer') {
        target.className = 'hover';
        // target.onclick = visit;
        url = target.getAttribute('data-url');
        if (current !== url) {
          hoverTimer = setTimeout(function () {
            current = url;
            render(url);
          }, 200);
        }
      }
    }
  });
})();