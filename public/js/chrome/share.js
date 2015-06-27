(function () {
  'use strict';
  /*globals $, panels, saveChecksum, jsbin, $document, documentTitle*/

  // only continue if the new share is enabled
  if ($('#sharemenu .share-split').length === 0) {
    return;
  }

  var mapping = {
    live: 'output',
    javascript: 'js'
  };
  var $sharepanels = $('#sharepanels input[type="checkbox"]');

  var selectedSnapshot = jsbin.state.revision;
  // var $snapshots = $('#snapshot').on('change', function () {
  //   selectedSnapshot = this.value * 1;

  //   $lockRevision.prop('checked', true);

  //   if (selectedSnapshot === jsbin.state.revision) {
  //     $lockRevision.trigger('change');
  //   }
  //   update();
  // }).hide();


  $document.on('saved', function () {
    selectedSnapshot = jsbin.state.revision;
  });

  $document.on('snapshot', function () {
    jsbin.state.changed = false;
    if (window.history.replaceState) {
      window.history.replaceState(null, '', jsbin.getURL({ withRevision: true }) + '/edit?' + panels.getQuery());
    }
  });

  var $sharemenu = $('#sharemenu').bind('open', function () {
    // select the right panels
    $sharepanels.prop('checked', false);
    jsbin.panels.getVisible().forEach(function (p) {
      $sharepanels.filter('[value="' + (mapping[p.id] || p.id) + '"]').prop('checked', true);
    });

    // if we're the latest bin, then allow the user to switch to a snapshot
    if (jsbin.state.latest) {
      // if they have write access then select the latest & live by default
      if (jsbin.state.checksum) {
        $realtime.prop('checked', jsbin.state.latest);
        $snapshot.prop('checked', false);

        $andlive.show();
      // otherwise select the snapshot first
      } else {
        $realtime.prop({ checked: false });
        $snapshot.prop('checked', true);
        $andlive.hide();
      }

      $withLiveReload.show();
    } else {
      // otherwise, disable live
      $realtime.prop({ checked: false, disabled: true });
      $snapshot.prop('checked', true);
      $withLiveReload.hide();
    }

    update();
  });
  $sharemenu.find('.lockrevision').on('change', function () {
    saveChecksum = false; // jshint ignore:line
    jsbin.state.checksum = false;
    $document.trigger('locked');
  });
  var $sharepreview = $('#share-preview');
  var $realtime = $('#sharebintype input[type=radio][value="realtime"]');
  var $snapshot = $('#sharebintype input[type=radio][value="snapshot"]');
  var link = $sharemenu.find('a.link')[0];
  var linkselect = $sharemenu.find('input[name="url"]')[0];
  var embed = $sharemenu.find('textarea')[0];
  var form = $sharemenu.find('form')[0];
  var $directLinks = $sharemenu.find('.direct-links');
  var $andlive = $('#andlive');
  var $withLiveReload = $sharemenu.find('.codecasting');

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
    var url = jsbin.getURL({ root: jsbin.shareRoot });
    var OGurl = jsbin.getURL();

    if (data.state === 'snapshot' && jsbin.state.latest) {
      url += '/' + selectedSnapshot;
      OGurl += '/' + selectedSnapshot;
    }

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

    // create the direct links, it'll be faster to inject HTML rather than
    // updating hrefs of a bunch of HTML elements
    $directLinks.empty();

    var directLinksHTML = []; //['<a href="' + url + '.html">html</a>'];

    var code = ''
    var ext = '';

    code = jsbin.panels.panels.html.getCode().trim();

    if (code) {
      ext = processors[jsbin.state.processors.html || 'html'].extensions[0];
      if (ext !== 'html') {
        directLinksHTML.push('<a target="_blank" href="' + url + '.' + ext + '">' + ext + '</a>');
      } else if (code.toLowerCase().indexOf('<svg') === 0) {
        directLinksHTML.push('<a target="_blank" href="' + url + '.svg">svg</a>');
      }
    }

    if (jsbin.panels.panels.css.getCode().trim()) {
      ext = processors[jsbin.state.processors.css || 'css'].extensions[0];
      if (ext !== 'css') {
        directLinksHTML.push('<a target="_blank" href="' + url + '.css">css</a>');
      }
      directLinksHTML.push('<a target="_blank" href="' + url + '.' + ext + '">' + ext + '</a>');
    }

    code = jsbin.panels.panels.javascript.getCode().trim();

    if (code) {
      ext = processors[jsbin.state.processors.javascript || 'javascript'].extensions[0];

      if (ext !== 'js') {
        directLinksHTML.push('<a target="_blank" href="' + url + '.js">js</a>');
      }

      try {
        JSON.parse(code);
        directLinksHTML.push('<a target="_blank" href="' + url + '.json">json</a>');
      } catch (e) {
        directLinksHTML.push('<a target="_blank" href="' + url + '.' + ext + '">' + ext + '</a>');
      }

    }

    $directLinks.html(directLinksHTML.join(''));

    linkselect.value = link.href = shareurl + query;
    embed.value = ('<a class="jsbin-embed" href="' + OGurl + '/embed' + query + '">' + documentTitle + ' on jsbin.com</a><' + 'script src="' + jsbin.static + '/js/embed.min.js?' + jsbin.version + '"><' + '/script>').replace(/<>"&/g, function (m) {
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
      $withLiveReload.hide();
    } else {
      $withLiveReload.show();
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