(function () {
  /*global jsbin, $, $body, $document, analytics, settings*/
  'use strict';

  if (!$('#toppanel').length) {
    return;
  }

  if (jsbin.settings.gui === undefined) {
    jsbin.settings.gui = {};
  }
  if (jsbin.settings.gui.toppanel === undefined) {
    jsbin.settings.gui.toppanel = true;
    store.localStorage.setItem('settings', JSON.stringify(jsbin.settings));
  }

  if ($body.hasClass('toppanel') && jsbin.settings.gui.toppanel === false) {
    $body.addClass('toppanel-close');
    $body.removeClass('toppanel');
  }

  // analytics for panel state
  analytics.welcomePanelState(jsbin.settings.gui.toppanel);

  var removeToppanel = function() {
    jsbin.settings.gui.toppanel = false;
    settings.save();
    $body.addClass('toppanel-close');
    $body.removeClass('toppanel');

    // $document.trigger('sizeeditors');
  };

  var showToppanel = function() {
    jsbin.settings.gui.toppanel = true;
    settings.save();
    $body.removeClass('toppanel-close');
    $body.addClass('toppanel');
  };

  var goSlow = function(e) {
    $body.removeClass('toppanel-slow');
    if (e.shiftKey) {
      $body.addClass('toppanel-slow');
    }
  };

  $('.toppanel-logo').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
    $document.trigger('sizeeditors');
  });

  $('.toppanel-hide').click(function(event) {
    event.preventDefault();
    goSlow(event);
    removeToppanel();
  });
  $('.toppanel-logo').click(function(event) {
    event.preventDefault();
    goSlow(event);
    showToppanel();
  });
  // $document.keydown(function (event) {
  //   if (event.which === 27) {
  //     if ($body.hasClass('toppanel')) {
  //       removeToppanel();
  //     }
  //   }
  // });

  function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle...
    while (m) {

      // Pick a remaining element...
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  $.ajax({
    // tries to cache once a day
    url: '/blog/all.json?' + (new Date()).toString().split(' ').slice(0, 4).join('-'),
    dataType: 'json',
    cache: true,
    success: function (data) {
      var blogpost = data.blog[0];
      // this is daft, but it means that the landing page is the same
      // for all, and ensures that blog comments end up on a single place
      var root = jsbin.root.replace(/^https/, 'http');
      $('.toppanel-blog ul').html('<li><a href="' + root + '/' + blogpost.slug + '" target="_blank" class="toppanel-link">' + blogpost.title.replace(/TWDTW.*:\s/, '') + '</a></li>');

      var last = null;
      var count = 1;
      try {
        last = store.localStorage.getItem('lastpost') || null;
      } catch (e) {}

      if (last !== null) {
        last *= 1;
        if (last < blogpost.timestamp) {
          count = data.blog.reduce(function (prev, current) {
            if (last < current.timestamp) {
              return prev + 1;
            }
            return prev;
          }, 0);
        } else {
          count = 0;
        }
      }

      if (count) {
        $('.blog a').attr('href', root + '/' + data.blog[count-1].slug).attr('data-count', count).on('click', function () {
          // this is a weird hack work around to try to clear the storage
          // item that says which was the last post viewed. so we update
          // the timestamp when the user clicks the link, because we know
          // they'll land on the latest post
          try {
            localStorage.lastpost = data.blog[count-1].timestamp;
          } catch (e) {}
        });
      }

      var help = shuffle(data.help);

      $('.toppanel-help ul').html('<li><a href="' + root + '/' + help[0].slug + '" target="_blank" class="toppanel-link">' + help[0].title + '</a></li><li><a href="' + root + '/' + help[1].slug + '" target="_blank" class="toppanel-link">' + help[1].title + '</a></li>');

    }
  })

  // analytics for links
  $('#toppanel').find('.toppanel-link').mousedown(function() {
    analytics.welcomePanelLink(this.href);
  });

}());