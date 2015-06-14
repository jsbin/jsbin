;(function (global) {
  if ('EventSource' in global) {
    return setupInfocard()
  } else {
    $.getScript(jsbin['static'] + '/js/vendor/eventsource.js', setupInfocard);
  }
  function setupInfocard() {
    /*global spinner, $, jsbin, prettyDate, EventSource, throttle, $document, analytics, throttle*/
    'use strict';

    // don't insert this on embeded views
    if (jsbin.embed) {
      return;
    }

    var $template = $('#infocard'); // donkey way of cloning from template
    var $header = $template.find('header');
    var canvas = $header.find('canvas')[0];
    var s = spinner(canvas);
    var htmlpanel = jsbin.panels.panels.html;
    var viewers = 0;
    var es = null;

    var re = {
      head: /<head(.*)\n/i,
      meta: /(<meta name="description" content=")([^"]*)/im,
      title: /<title>(.*)<\/title>/im
    };

    if ($template.length === 0) {
      return;
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

    function listenStats(owner) {
      if (window.EventSource && owner) {
        // TODO use pagevisibility api to close connection
        if (es) {
          es.close();
        }
        es = new EventSource(jsbin.getURL() + '/stats?checksum=' + jsbin.state.checksum);
        es.addEventListener('stats', throttle(updateStats, 1000));
      }
    }

    function insertTag(tag) {
      var cm = htmlpanel.editor;
      var html = htmlpanel.getCode();

      if (tag === 'meta') {
        tag = 'meta name="description';
      }


      if (html.indexOf('<' + tag) === -1) {
        var userhtml = getPanelText(tag === 'title' ? 'title' : 'description', '');
        if (re.head.test(html)) {
          html = html.replace(re.head, '<head$1\n' + userhtml);
        } else {
          // slap in the top
          html = userhtml + html;
        }
        htmlpanel.setCode(html);
      }
    }

    function getPanelText(type, text) {
      var processor = jsbin.state.processors.html;

      text = text.replace(/"/g, '&quot;');

      if (type === 'title') {
        if (processor === 'jade') {
          return 'title ' + text + '\n';
        }

        return '<title>' + text + '</title>\n';
      }

      if (type === 'description') {
        if (processor === 'jade') {
          return 'meta(name="description", content="' + text + '")\n';
        }

        return '<meta name="description" content="' + text + '">\n';
      }

      return text;
    }


    if ($template.find('.settings')) {
      $template.find('#title').on('input', function () {
        insertTag('title');
        var html = htmlpanel.getCode();
        var value = this.value;
        var result = html.replace(re.title, function (all, capture) {
          return '<title>' + value.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</title>';
        });
        updateCode(result);
        jsbin.state.updateSettings({ title: this.value });
      });

      $template.find('#description').on('input', function () {
        insertTag('meta');
        var html = htmlpanel.getCode();
        var value = this.value;
        var result = html.replace(re.meta, function (all, capture) {
          return capture + value.replace(/"/g, '&quot;');
        });
        updateCode(result);
        jsbin.state.updateSettings({ description: this.value });
      });
    }

    function updateCode(result) {
      // capture selection and cursor
      var state = null;
      var cursor = null;
      var cm = htmlpanel.editor;
      var selected = cm.somethingSelected();
      if (jsbin.panels.panels.html.visible) {
        if (selected) {
          state = cm.listSelections();
        }
        cursor = cm.getCursor();
      }

      htmlpanel.setCode(result);

      // then restore
      if (jsbin.panels.panels.html.visible) {
        cm.setCursor(cursor);
        if (selected) {
          cm.setSelections(state);
        }
      }
    }

    function updateInfoCard(event) {
      var meta = jsbin.state.metadata || {};
      var classes = [];
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

      if (s) {
        s.stop();
      }

      if (!jsbin.state.streaming || owner === true) {
        $header.find('time').html(event ? 'just now' : prettyDate(meta.last_updated));
      } else if (owner === false) {
        $header.find('time').html('Streaming');
        classes.push('streaming');
        if (s) {
          s.start();
        }
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
      }

      if (jsbin.state.streaming) {
        if (window.EventSource && owner) {
          listenStats(owner);
          handleVisibility(owner);
          var url = jsbin.getURL();
          $document.on('saved', function () {
            var newurl = window.location.toString();
            if (url !== newurl) {
              es.close();
              listenStats(owner);
            }
          });
        } else if (jsbin.saveDisabled === true && window.location.pathname.slice(-5) === '/edit') {
          $.getScript(jsbin.static + '/js/spike.js?' + jsbin.version);
          $document.on('stats', throttle(updateStats, 1000));
        }
      }
    }

    function handleVisibility(owner) {
      var hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
        null;
      var visibilityStateProperty = 'visibilityState' in document ? 'visibilityState' :
        'webkitVisibilityState' in document ? 'webkitVisibilityState' :
        'mozVisibilityState' in document ? 'mozVisibilityState' :
        null;

      if (visibilityStateProperty) {
        var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
        document.addEventListener(visibilityChangeEvent, function visibilityChangeEvent() {
          if (document[hiddenProperty]) { // hidden
            es.close();
          } else {
            listenStats(owner);
          }
        });
      }
    }

    function initHandlers() {
      $header.on('mousedown touchstart', function (e) {
        e.preventDefault();
        analytics.infocard('click', 'no-result');
        var toTrigger;
        $template.toggleClass(function (index, klass) {
          toTrigger = klass.indexOf('open') === -1 ? 'open' : 'close';
          return 'open';
        }).trigger(toTrigger);
      });

      $template.one('open', function () {
        var statusCode = $('#status').data('status') || 200;
        $.getJSON(jsbin.static + '/js/http-codes.json', function (codes) {
          var html = '';
          codes.forEach(function (code) {
            html += '<option value="' + code.code + '">' + code.string + '</option>';
          });
          $('#status').html(html).val(statusCode).on('change', function () {
            jsbin.state.updateSettings({ statusCode: this.value });
          });
        });
      }).on('close', function () {

      });

      function updateHeaders() {
        // grab all the headers with values and send that instead
        var headers = {};
        $template.find('.row').each(function () {
          if ($(this).find('[name="header-value"]').val().trim()) {
            headers[$(this).find('input:first').val()] = $(this).find('input:last').val();
          }
        });

        jsbin.state.updateSettings({ headers: headers }, 'PUT');
      }

      var $headers = $template.find('#headers');
      $template.on('click', '#headers button', function (event) {
        event.preventDefault();
        var $fields = $headers.find('span:last');
        updateHeaders();

        var $clones = $fields.clone(true);
        $fields.before($clones);
        $fields.find('input').val('').eq(0).focus();
      });

      $template.on('input', '.row input', function () {
        updateHeaders($(this).closest('.row'));
      });
    }

    initHandlers();
    updateInfoCard();
    $document.bind('saved', updateInfoCard);
  }
}(this));
