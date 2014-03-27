(function () {
  'use strict';
  /*globals $, saveChecksum, jsbin, $document, documentTitle*/

  var mapping = {
    live: 'output',
    javascript: 'js'
  };
  var $sharepanels = $('#sharepanels input[type="checkbox"]');
  var $snapshots = $('#snapshot');
  var $sharemenu = $('#sharemenu').bind('open', function () {
    // select the right panels
    $sharepanels.prop('checked', false);
    jsbin.panels.getVisible().forEach(function (p) {
      $sharepanels.filter('[value="' + (mapping[p.id] || p.id) + '"]').prop('checked', true);
    });

    var options = '';
    var i = jsbin.state.revision;
    do {
      options += '<option>' + i + '</option>';
    } while (--i);

    $snapshots.html(options);

    update();
  });
  var $sharepreview = $('#share-preview');
  var $realtime = $('#sharebintype input[type=radio][value="realtime"]');
  var link = $sharemenu.find('a.link')[0];
  var linkselect = $sharemenu.find('input[name="url"]')[0];
  var embed = $sharemenu.find('textarea')[0];
  var form = $sharemenu.find('form')[0];

  // get an object representation of a form's state
  function formData(form) {
    var length = form.length;
    var data = {};
    var value;
    var el;
    var type;
    var name;

    var append = function (data, name, value) {
      if (data[name] === undefined) {
        data[name] = value;
      } else {
        if (typeof data[name] === 'string') {
          data[name] = [data[name]];
        }
        data[name].push(value);
      }
    };

    for (var i = 0; i < length; i++) {
      el = form[i];
      value = el.value;
      type = el.type;
      name = el.name;

      if (type === 'radio') {
        if (el.checked) {
          append(data, name, value);
        }
      } else if (type === 'checkbox') {
        if (data[name] === undefined) {
          data[name] = [];
        }
        if (el.checked) {
          append(data, name, value);
        }
      } else {
        append(data, name, value);
      }
    }

    return data;
  }

  function update() {
    var data = formData(form);
    var withRevision = data.state === 'snapshot';
    var url = jsbin.getURL({ revision: withRevision });
    var shareurl = url;

    // get a comma separated list of the panels that should be shown
    var query = data.panel.join(',');

    if (query) {
      query = '?' + query;
    }

    $sharepanels.prop('disabled', data.view === 'output');
    $sharepreview.attr('class', data.view);

    if (data.view !== 'output') {
      $sharepreview.find('.editor div').each(function () {
        this.hidden = data.panel.indexOf(this.className) === -1;
      });
    }

    if (data.view === 'editor') {
      shareurl += '/edit';
    } else {
      query = '';
    }


    linkselect.value = link.href = shareurl + query;
    embed.value = ('<a class="jsbin-embed" href="' + url + '/embed' + query + '">' + documentTitle + '</a><' + 'script src="' + jsbin.static + '/js/embed.js"><' + '/script>').replace(/<>"&/g, function (m) {
        return {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          '&': '&amp;'
        }[m];
      });
  }

  // when the user clicks on "snapshot" we automatically create a snapshot at
  // that point (technically this isn't a snapshot, but clearing the write
  // access, so the next user input creates the *next* snapshot - which is
  // actually the latest copy).
  $('#sharebintype input[type=radio]').on('change', function () {
    if (this.value === 'snapshot') {
      jsbin.state.checksum = false;
      saveChecksum = false; // jshint ignore:line
    }
  });

  $sharemenu.find('input').on('change', update);

  $document.on('saved', function () {

    // revert to the latest bin state
    $realtime.prop('checked', true);

    // show the share menu
    $sharemenu.removeClass('hidden');

    update();
  });
})();