;(function () {

  var loadList = function () {
    $('#history').remove();
    $.ajax({
      dataType: 'html',
      url: jsbin.root + '/list',
      error: function () {
        setTimeout(loadList, 500);
      },
      success: function (html) {
        $body.append(html);
        hookUserHistory();
      }
    });
  };

  var updatePreview = function(url, $iframe) {
    $iframe.attr('src', url + '/quiet');
    $iframe.removeAttr('hidden');
  };

  var updateViewing = function (url, $viewing) {
    $viewing.text(url);
  };

  var updateLayout = function ($tbodys, archiveMode) {
    $tbodys.each(function () {
      var $tbody = $(this),
          filter = archiveMode ? '.archived' : ':not(.archived)',
          $trs = $('tr' + filter, $tbody).filter(':not(.spacer)');
      $trs.filter('.first').removeClass('first');
      if ($trs.length > 0) {
        $tbody.removeClass('hidden');
        $trs.first().addClass('first');
      } else {
        $tbody.addClass('hidden');
      }
    });
  };

  var hookUserHistory = function () {
    var $history = $('#history');
    if (!$history.length) return;

    var $iframe = $('iframe', $history),
        $viewing = $('#viewing', $history),
        $bins = $history,
        $tbodys = $('tbody', $history),
        $trs = $('tr', $history),
        $created = $('td.created a', $history),
        $toggle = $('.toggle_archive', $history),
        current = null,
        hoverTimer = null,
        layoutTimer = null;

    // Load bin from data-edit-url
    $bins.delegate('tr', 'click', function () {
      if (event.shiftKey || event.metaKey) return;
      window.location = this.getAttribute('data-edit-url');
    });

    $bins.delegate('.archive, .unarchive', 'click', function (e) {
      var $this = $(this),
          $row = $this.parents('tr');
      $row.toggleClass('archived');
      updateLayout($tbodys, $history.hasClass('archive_mode'));
      $.ajax({
        type: 'POST',
        url: $this.attr('href'),
        error: function () {
          alert("Something went wrong, please try again");
          $row.toggleClass('archived');
          updateLayout($tbodys, $history.hasClass('archive_mode'));
        },
        success: function () {}
      });
      return false;
    });

    // Toggle show archive
    $toggle.change(function () {
      $history.toggleClass('archive_mode');
      updateLayout($tbodys, $history.hasClass('archive_mode'));
    });

    // Delay a preview load after tr mouseover
    $bins.delegate('tr', 'mouseover', function (event) {
      var $this = $(this),
          url = $this.attr('data-url');
      clearTimeout(hoverTimer);
      if (!$this.hasClass('spacer') && current !== url) {
        hoverTimer = setTimeout(function () {
          $trs.removeClass('selected');
          $this.addClass('selected');
          current = url;
          updatePreview(url, $iframe);
          updateViewing(url, $viewing);
        }, 400);
      }
      return false;
    });

    // Update the time every 30 secs
    // Need to replace Z in ISO8601 timestamp with +0000 so prettyDate() doesn't
    // completely remove it (and parse the date using the local timezone).
    $('a[pubdate]', $history).attr('pubdate', function (i, val) {
      return val.replace('Z', '+0000');
    }).prettyDate();
    setInterval(function(){
      $created.prettyDate();
    }, 30 * 1000);

    setTimeout(updateLayout.bind(null, $tbodys, false), 0);

  };

  // inside a ready call because history DOM is rendered *after* our JS to improve load times.
  $(function ()  {
    if (jsbin.embed) return;

    var $panelButtons = $('#panels a'),
        $homebtn = $('.homebtn'),
        panelsVisible = $body.hasClass('panelsVisible');

    var panelCloseIntent = function() {
      var activeCount = $panelButtons.filter('.active').length;
      if (activeCount === 1 && $(this).hasClass('active')) {
        loadList();
      }
    };

    // this code attempts to only call the list ajax request only if
    // the user should want to see the list page - most users will
    // jump in and jump out of jsbin, and never see this page,
    // so let's not send this ajax request.
    //
    // The list should be loaded when:
    //   - user hovers the home button
    //   - they arrive at the page with no panels open
    //   - they close all the panels

    if (!panelsVisible) {
      loadList();
    } else {
      $homebtn.one('hover', loadList);
      $panelButtons.on('mousedown', panelCloseIntent);
    }

  });

}());
