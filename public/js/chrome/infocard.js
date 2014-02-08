(function () {
  'use strict';
  /*global $:true, jsbin:true, prettyDate:true, EventSource:true, throttle:true, $document:true*/
  var $template = $($('#infocard').html()); // donkey way of cloning from template
  var $header = $template.find('header');
  var meta = jsbin.state.metadata || {};
  var classes = [];
  var es = null;
  var owner = false;

  if (meta.name) {
    $header.find('.name b').html(meta.name);
    $header.find('img').attr('src', meta.avatar);
  }

  $header.find('time').html(prettyDate(meta.last_updated));

  if (!jsbin.checksum) {
    classes.push('meta');
  }

  if (meta.pro) {
    classes.push('pro');
  }

  if (jsbin.user && (meta.name === jsbin.user.name)) {
    owner = true;
    classes.push('author');
  }

  $header.find('.visibility').text(meta.visibility);

  if (meta.visibility === 'private') {
    classes.push('private');
  } else if (meta.visibility === 'public') {
    classes.push('public');
  } // TODO handle team

  if (jsbin.state.code) {
    $template.addClass(classes.join(' ')).appendTo('body');

    $header.click(function (e) {
      e.preventDefault();
      $template.toggleClass('open');
    });

    var viewers = 0;

    if (window.EventSource && owner) {
      listenStats();
      var url = jsbin.getURL();
      $document.on('saved', function () {
        var newurl = window.location.toString();
        if (url !== newurl) {
          es.close();
          listenStats();
        }
      });
    } else {
      $document.on('stats', throttle(updateStats, 1000));
    }
  }

  function updateStats(event, _data) {
    var data = _data ? JSON.parse(_data) : JSON.parse(event.data);

    if (data.connections > 0 && viewers === 0) {
      $template.addClass('viewers');
    }

    if (viewers !== data.connections) {
      var $b = $header.find('.viewers b').removeClass('up down').html('<b>' + data.connections + '<br>' + viewers + '<br>' + data.connections + '</b>'),
          c = viewers > data.connections ? 'down' : 'up';
      setTimeout(function () {
        $b.addClass(c);
      }, 0);
    }

    viewers = data.connections;

    if (viewers === 0) {
      setTimeout(function () {
        $template.removeClass('viewers');
      }, 250);
    }

  }

  function listenStats() {
    es = new EventSource(jsbin.getURL() + '/stats?checksum=' + jsbin.state.checksum);
    es.addEventListener('stats', throttle(updateStats, 1000));
  }
})();