var listLoaded = false;

function loadList() {
  if (listLoaded) {
    return;
  }
  listLoaded = true;

  $.ajax({
    dataType: 'html',
    url: jsbin.root + '/list',
    error: function () {
      listLoaded = false;
      setTimeout(loadList, 500);
    },
    success: function (html) {
      $body.append(html);
      hookUserHistory();
    }
  });
}

function hookUserHistory() {
  if ($('#history').length) (function () {
    function render(url) {
      if (url.lastIndexOf('/') !== url.length - 1) {
        url += '/';
      }
      iframe.src = url + 'quiet';
      iframe.removeAttribute('hidden');
      viewing.innerHTML = url;
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

    function visit(event) {
      if (event.shiftKey || event.metaKey) return;
      window.location = this.getAttribute('data-edit-url');
    }

    var preview = $('#history .preview'),
        iframe = $('#history iframe')[0],
        bins = $('#history'),
        trs = $('#history tr'),
        current = null,
        viewing = $('#history #viewing')[0],
        hoverTimer = null;

    // stop iframe load removing focus from our main window
    bins.delegate('tr', 'click', visit);
    // this is some nasty code - just because I couldn't be
    // bothered to bring jQuery to the party.
    bins.mouseover(function (event) {
      clearTimeout(hoverTimer);
      var url, target = event.target;
      if (target = matchNode(event.target, 'TR')) {
        if (target.getAttribute('data-type') !== 'spacer') {
          // target.className = 'hover';
          // target.onclick = visit;
          url = target.getAttribute('data-url');
          if (current !== url) {
            hoverTimer = setTimeout(function () {
              bins.find('tr').removeClass('selected').filter(target).addClass('selected');
              current = url;
              render(url);
            }, 400);
          }
        }
      }
      return false;
    });

    // Need to replace Z in ISO8601 timestamp with +0000 so prettyDate() doesn't
    // completely remove it (and parse the date using the local timezone).
    $('#history a[pubdate]').attr('pubdate', function (i, val) {
      return val.replace('Z', '+0000');
    }).prettyDate();
    setInterval(function(){ $('#history td.created a').prettyDate(); }, 30 * 1000);

  })();
}

// inside a ready call because history DOM is rendered *after* our JS to improve load times.
if (!jsbin.embed) $(function ()  {

  // this code attempts to only call the list ajax request only if
  // the user should want to see the list page - most users will
  // jump in and jump out of jsbin, and never see this page,
  // so let's not send this ajax request.
  setTimeout(function () {
    var panelsVisible = $body.hasClass('panelsVisible');

    if (!panelsVisible) {
      loadList();
    } else {
      // if the user hovers over their profile page or the 'open' link, then load the list then
      $('.homebtn').one('hover', loadList);
      function panelCloseIntent() {
        var activeCount = $panelButtons.filter('.active').length;
        if (activeCount === 1 && $(this).hasClass('active')) {
          $panelButtons.unbind('mousedown', panelCloseIntent);
          loadList();
        }
      };

      var $panelButtons = $('#panels a').on('mousedown', panelCloseIntent);
    }
  }, 0);

});
