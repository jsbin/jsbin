;(function () {
  /*global jsbin, $, $document, analytics*/
  'use strict';
  if (!jsbin.user || !jsbin.user.name || jsbin.embed) {
    return;
  }

  var $body = $('body'),
      loaded = false,
      requestAttempts = 5,
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
    if (loaded) {
      return;
    }

    if ($('html').hasClass('public-listing')) {
      hookUserHistory();
    } else {
      $.ajax({
        dataType: 'html',
        url: jsbin.root + '/list',
        error: function () {
          requestAttempts--;
          if (requestAttempts > 0) {
            $('#history').remove();
            setTimeout(loadList, 500);
          } else {
            console.error('Giving up to load history');
          }
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
    $viewing.html('<a href="' + url + '">' + url + '</a>');
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
    if (!$history.length) {
      return $history;
    }

    // Cache some useful elements
    var $iframe = $('iframe', $history),
        $viewing = $('#viewing', $history),
        $bins = $history,
        $tbodys = $('tbody', $history),
        $trs = $('tr', $history),
        $toggle = $('.toggle_archive', $history),
        current = null,
        hoverTimer = null;

    // Archive & un-archive click handlers
    $bins.delegate('.archive, .unarchive', 'click', function () {
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
          alert('Something went wrong, please try again');
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

    var selected = null;
    $bins.delegate('a', 'click', function (event) {
      if (event.shiftKey || event.metaKey) { return; }
      
      var $this = $(this);

      if ($this.closest('.action').length) {
        // let the existing handlers deal with action links
        return;
      }

      event.preventDefault();
      event.stopPropagation(); // prevent further delegates
      if ($this.data('toggle') === 'history') {
        jsbin.panels.allEditors(function (panel) {
          if (panel.editor.getCode().trim().length) {
            panel.show();
          }
        });
        return;
      }
      var $tr = $this.closest('tr');
      var data = $tr.data();
      var url = jsbin.root + data.url;

      if (selected === this) {
        window.location = data.editUrl;
      } else {
        $trs.removeClass('selected');
        $tr.addClass('selected');
        updatePreview(url, $iframe);
        updateViewing(url, $viewing);

        selected = this;
      }
    });

    // Load bin from data-edit-url attribute when user clicks on a row
    $bins.delegate('tr:not(.spacer)', 'click', function (event) {
      if (event.shiftKey || event.metaKey) { return; }
      $(this).find('.url a:first').click();
    });

    // Update the time every 30 secs
    // Need to replace Z in ISO8601 timestamp with +0000 so prettyDate() doesn't
    // completely remove it (and parse the date using the local timezone).
    $('a[pubdate]', $history).attr('pubdate', function (i, val) {
      return val.replace('Z', '+0000');
    }).prettyDate();

    // Update the layout straight away
    setTimeout(function () {
      updateLayout($tbodys, false);
    }, 0);

    $document.trigger('history:open');

    return $history;
  };

  // inside a ready call because history DOM is rendered *after* our JS to improve load times.
  $(document).on('jsbinReady', function ()  {
    if (jsbin.embed) {
      return;
    }

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
