(function () {
  /*global $:true, jsbin:true, prettyDate:true, EventSource:true, throttle:true, $document:true*/
  'use strict';

  // don't insert this on embeded views
  if (jsbin.embed) {
    return;
  }

  var $template = $('#infocard'); // donkey way of cloning from template
  var $header = $template.find('header');
  var canvas = $header.find('canvas')[0];
  var s = spinner(canvas);

  if ($template.length === 0) {
    return;
  }

  function updateInfoCard(event) {
    var meta = jsbin.state.metadata || {};
    var classes = [];
    var es = null;
    var owner = false;

    if (meta.name) {
      $header.find('.name b').html(meta.name);
      $header.find('img').attr('src', meta.avatar);
      classes.push(meta.name);
    }

    if (jsbin.state.checksum || (jsbin.user && (meta.name === jsbin.user.name))) {
      owner = true;
      classes.push('author');
    }

    s.stop();

    if (!jsbin.state.streaming || owner === true) {
      $header.find('time').html(event ? 'just now' : prettyDate(meta.last_updated));
    } else if (owner === false) {
      $header.find('time').html('Streaming');
      classes.push('streaming');
      s.start();
    }

    if (!jsbin.checksum) {
      classes.push('meta');
    }

    if (meta.pro) {
      classes.push('pro');
    }

    $header.find('.visibility').text(meta.visibility);

    if (meta.visibility === 'private') {
      classes.push('private');
    } else if (meta.visibility === 'public') {
      classes.push('public');
    } // TODO handle team

    if (jsbin.state.code) {
      $template.addClass(classes.join(' ')).parent().removeAttr('hidden');

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
      } else if (jsbin.saveDisabled === true && window.location.pathname.slice(-5) === '/edit') {
        $.getScript(jsbin.static + '/js/spike.js?' + jsbin.version);
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
  }

  updateInfoCard();
  $document.bind('saved', updateInfoCard);
})();
