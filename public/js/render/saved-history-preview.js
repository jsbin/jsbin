;(function () {
  var $body = $('body'),
      loaded = false,
      $history; // set in hookUserHistory()

  $document.on('history:open', function () {
    if ($history && jsbin.panels.getVisible().length === 0) {
      $history.appendTo('body');
    }
  }).on('history:close', function () {
    if ($history === null) {
      $history = $('#history').detach();
    }
  });

  var loadList = function () {
    if (loaded) return;

    if ($('html').hasClass('public-listing')) {
      hookUserHistory();
    } else {
      $.ajax({
        dataType: 'html',
        url: jsbin.root + '/list',
        error: function () {
          $('#history').remove();
          setTimeout(loadList, 500);
        },
        success: function (html) {
          $('#history').remove();
          $body.append(html);
          hookUserHistory();
          loaded = true;
        }
      });
    }
  };

  var updatePreview = function(url, $iframe) {
    $iframe.attr('src', url + '/quiet');
    $iframe.removeAttr('hidden');
  };

  var updateViewing = function (url, $viewing) {
    $viewing.text(url);
  };

  var updateLayout = function ($tbodys, archiveMode) {
    var $parent = $tbodys.parent();
    $tbodys
      .detach()
      .each(function () {
        var $tbody = $(this),
            filter = archiveMode ? '.archived' : ':not(.archived)',
            $trs = $('tr' + filter, $tbody).filter(':not(.spacer)');
        if ($trs.length > 0) {
          $trs.filter('.first').removeClass('first');
          $tbody.removeClass('hidden');
          $trs.first().addClass('first');
        } else {
          $tbody.addClass('hidden');
        }
      })
      .appendTo($parent);
  };

  var hookUserHistory = function () {
    // Loading the HTML from the server may have failed
    $history = $('#history').detach();
    if (!$history.length) return $history;

    // Cache some useful elements
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

    // Load bin from data-edit-url attribute when user clicks on a row
    $bins.delegate('tr:not(.spacer)', 'click', function () {
      if (event.shiftKey || event.metaKey) return;
      window.location = this.getAttribute('data-edit-url');
    });

    // Archive & un-archive click handlers
    $bins.delegate('.archive, .unarchive', 'click', function (e) {
      var $this = $(this),
          $row = $this.parents('tr');
      // Instantly update this row and the page layout
      $row.toggleClass('archived');

      analytics[this.pathname.indexOf('unarchive') === -1 ? 'archive' : 'unarchive'](jsbin.root + $row.data('url'));

      updateLayout($tbodys, $history.hasClass('archive_mode'));
      // Then send the update to the server
      $.ajax({
        type: 'POST',
        url: $this.attr('href'),
        error: function () {
          // Undo if something went wrong
          alert("Something went wrong, please try again");
          $row.toggleClass('archived');
          updateLayout($tbodys, $history.hasClass('archive_mode'));
        },
        success: function () {}
      });
      return false;
    });

    // Handle toggling of archive view
    $toggle.change(function () {
      $history.toggleClass('archive_mode');
      var archive = $history.hasClass('archive_mode');
      analytics.archiveView(archive);
      updateLayout($tbodys, archive);
    });


    // Load a preview on tr mouseover (delayed by 400ms)
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

    // Update the layout straign away
    setTimeout(function () {
      updateLayout($tbodys, false);
    }, 0);

    $document.trigger('history:open');

    return $history;
  };

  // inside a ready call because history DOM is rendered *after* our JS to improve load times.
  $(document).on('jsbinReady', function ()  {
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
    //   - they close all the panels
    //   - they arrive at the page with no panels open

    $homebtn.on('click', loadList);
    $panelButtons.on('mousedown', panelCloseIntent);

    if (!panelsVisible) {
      loadList();
    }

  });

}());
