/*jshint strict: false */
/*globals $, analytics, jsbin, documentTitle, $document, throttle, editors*/

var saving = {
  todo: {
    html: false,
    css: false,
    javascript: false
  },
  _inprogress: false,
  inprogress: function (inprogress) {
    if (typeof inprogress === 'undefined') {
      return saving._inprogress;
    }

    saving._inprogress = inprogress;
    if (inprogress === false) {
      var panels = ['html','css','javascript'];

      var save = function () {
        var todo = panels.pop();
        if (todo && saving.todo[todo]) {
          saving._inprogress = true;
          updateCode(todo, save);
          saving.todo[todo] = false;
        } else if (todo) {
          save();
        }
      };

      save();
    }
  }
};

function getTagContent(tag) {
  var html = jsbin.panels.panels.html.getCode();
  var result = '';

  // if we don't have the tag, bail with an empty string
  if (html.indexOf('<' + tag) === -1) {
    return result;
  }

  if (tag !== 'title' && tag !== 'meta') {
    console.error('getTagContent for ' + tag + ' is not supported');
    return result;
  }

  // grab the content based on the earlier defined regexp
  html.replace(getTagContent.re[tag], function (all, capture1, capture2) {
    result = tag === 'title' ? capture1 : capture2;
  });

  return result;
}

getTagContent.re = {
  meta: /(<meta name="description" content=")([^"]*)/im,
  title: /<title>(.*)<\/title>/im
};


// to allow for download button to be introduced via beta feature
$('a.save').click(function (event) {
  event.preventDefault();

  analytics.milestone();
  // if save is disabled, hitting save will trigger a reload
  var ajax = true;
  if (jsbin.saveDisabled === true) {
    ajax = false;
  }

  if (jsbin.state.changed || !jsbin.owner()) {
    saveCode('save', ajax);
  }

  return false;
});

var $shareLinks = $('#share .link');
var $panelCheckboxes = $('#sharemenu #sharepanels input');

// TODO remove split when live
var split = $('#sharemenu .share-split').length;

// TODO candidate for removal
function updateSavedState() {
  'use strict';
  if (split) {
    return;
  }

  var mapping = {
    live: 'output',
    javascript: 'js',
    css: 'css',
    html: 'html',
    console: 'console'
  };

  var withRevision = true;

  var query = $panelCheckboxes.filter(':checked').map(function () {
    return mapping[this.getAttribute('data-panel')];
  }).get().join(',');
  $shareLinks.each(function () {
    var path = this.getAttribute('data-path');
    var url = jsbin.getURL({ withRevision: withRevision }) + path + (query && this.id !== 'livepreview' ? '?' + query : ''),
        nodeName = this.nodeName;
    var hash = panels.getHighlightLines();

    if (hash) {
      hash = '#' + hash;
    }

    if (nodeName === 'A') {
      this.href = url;
    } else if (nodeName === 'INPUT') {
      this.value = url;
      if (path === '/edit') {
        this.value += hash;
      }
    } else if (nodeName === 'TEXTAREA') {
      this.value = ('<a class="jsbin-embed" href="' + url + hash + '">' + documentTitle + '</a><' + 'script src="' + jsbin.static + '/js/embed.js"><' + '/script>').replace(/<>"&/g, function (m) {
          return {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '&': '&amp;'
          }[m];
        });
    }
  });
}

$('#sharemenu').bind('open', updateSavedState);
$('#sharebintype input[type=radio]').on('click', function () {
  if (this.value === 'snapshot') {
    jsbin.state.checksum = false;
    saveChecksum = false;
  }
  updateSavedState();
});

var lastHTML = null;

function updateDocMeta(event, data) {
  if (data) {
    if (data.panelId !== 'html') {
      return; // ignore non-html updates
    }
  }

  var currentHTML = jsbin.panels.panels.html.getCode();
  if (lastHTML !== currentHTML) {
    lastHTML = currentHTML;

    var description = getTagContent('meta');
    if (description !== jsbin.state.description) {
      jsbin.state.description = description;
      jsbin.state.updateSettings({ description: description });
    }

    var title = getTagContent('title');
    if (title !== jsbin.state.title) {
      jsbin.state.title = title;
      jsbin.state.updateSettings({ title: title });

      documentTitle = title;
      if (documentTitle) {
        document.title = documentTitle + ' - ' + jsbin.name;
      } else {
        document.title = jsbin.name;
      }
    }
  }
}

$document.on('saveComplete', updateDocMeta); // update, not create

$document.on('saved', function () {
  jsbin.state.changed = false;
  updateSavedState();

  $('#sharebintype input[type=radio][value="realtime"]').prop('checked', true);

  $shareLinks.closest('.menu').removeClass('hidden');

  $('#jsbinurl').attr('href', jsbin.getURL()).removeClass('hidden');
  $('#clone').removeClass('hidden');

  updateDocMeta();
});

var saveChecksum = jsbin.state.checksum || store.sessionStorage.getItem('checksum') || false;

// store it back on state
jsbin.state.checksum = saveChecksum;

if (saveChecksum) {
  // remove the disabled class, but also remove the cancelling event handlers
  $('#share div.disabled').removeClass('disabled').unbind('click mousedown mouseup');
} else {
  $('#share div.disabled').one('click', function (event) {
    event.preventDefault();
    $('a.save').click();
  });
}

$document.one('saved', function () {
  $('#share div.disabled').removeClass('disabled').unbind('click mousedown mouseup');
});

function onSaveError(jqXHR, panelId) {
  if (jqXHR.status === 413) {
    // Hijack the tip label to show an error message.
    $('#tip p').html('Sorry this bin is too large for us to save');
    $(document.documentElement).addClass('showtip');
  } else if (jqXHR.status === 403) {
    $document.trigger('tip', {
      type: 'error',
      content: 'I think there\'s something wrong with your session and I\'m unable to save. <a href="' + window.location + '"><strong>Refresh to fix this</strong></a>, you <strong>will not</strong> lose your code.'
    });
  } else if (panelId) {
    if (panelId) { savingLabels[panelId].text('Saving...').animate({ opacity: 1 }, 100); }
    window._console.error({message: 'Warning: Something went wrong while saving. Your most recent work is not saved.'});
  }
}



// only start live saving it they're allowed to (whereas save is disabled if they're following)
if (!jsbin.saveDisabled) {
  $('.code.panel .label .name').append('<span>Saved</span>');

  var savingLabels = {
    html: $('.panel.html .name span'),
    javascript: $('.panel.javascript .name span'),
    css: $('.panel.css .name span')
  };

  $document.bind('jsbinReady', function () {
    jsbin.state.changed = false;
    jsbin.panels.allEditors(function (panel) {
      panel.on('processor', function () {
        // if the url doesn't match the root - i.e. they've actually saved something then save on processor change
        if (jsbin.root !== jsbin.getURL()) {
          $document.trigger('codeChange', [{ panelId: panel.id }]);
        }
      });
    });

    $document.bind('codeChange', function (event, data) {
      jsbin.state.changed = true;
      // savingLabels[data.panelId].text('Saving');
      if (savingLabels[data.panelId]) {
        savingLabels[data.panelId].css({ 'opacity': 0 }).stop(true, true);
      }
    });

    $document.bind('saveComplete', throttle(function (event, data) {
      // show saved, then revert out animation
      savingLabels[data.panelId]
        .text('Saved')
        .stop(true, true)
        .animate({ opacity: 1 }, 100)
        .delay(1200)
        .animate({ opacity: 0 }, 500);
    }, 500));

    $document.bind('codeChange', throttle(function (event, data) {
      if (!data.panelId) {
        return;
      }

      if (jsbin.state.deleted) {
        return;
      }

      var panelId = data.panelId;

      jsbin.panels.savecontent();

      if (saving.inprogress()) {
        // queue up the request and wait
        saving.todo[panelId] = true;
        return;
      }

      saving.inprogress(true);

      // We force a full save if there's no checksum OR if there's no bin code/url
      if (!saveChecksum || !jsbin.state.code) {
        // create the bin and when the response comes back update the url
        saveCode('save', true);
      } else {
        updateCode(panelId);
      }
    }, 250));
  });
} else {
  $document.one('jsbinReady', function () {
    'use strict';
    var shown = false;
    if (!jsbin.embed && !jsbin.sandbox) {
      $document.on('codeChange.live', function (event, data) {
        if (!data.onload && !shown && data.origin !== 'setValue') {
          shown = true;
          var ismac = navigator.userAgent.indexOf(' Mac ') !== -1;
          var cmd = ismac ? '⌘' : 'ctrl';
          var shift = ismac ? '⇧' : 'shift';
          var plus = ismac ? '' : '+';

          $document.trigger('tip', {
            type: 'notification',
            content: 'You\'re currently viewing someone else\'s live stream, but you can <strong><a class="clone" href="' + jsbin.root + '/clone">clone your own copy</a></strong> (' + cmd + plus + shift + plus + 'S) at any time to save your edits'
          });
        }
      });
    }
  });
}

function compressKeys(keys, obj) {
  obj.compressed = keys;
  keys.split(',').forEach(function (key) {
    obj[key] = LZString.compressToUTF16(obj[key]);
  });
}

function updateCode(panelId, callback) {
  var panelSettings = {};

  if (jsbin.state.processors) {
    panelSettings.processors = jsbin.state.processors;
  }

  var data = {
    code: jsbin.state.code,
    revision: jsbin.state.revision,
    method: 'update',
    panel: panelId,
    content: editors[panelId].getCode(),
    checksum: saveChecksum,
    settings: JSON.stringify(panelSettings),
  };

  if (jsbin.settings.useCompression) {
    compressKeys('content', data);
  }

  if (jsbin.state.processors[panelId] &&
    jsbin.state.processors[panelId] !== panelId &&
    jsbin.state.cache[panelId]) {
    data.processed = jsbin.state.cache[panelId].result;
  }

  $.ajax({
    url: jsbin.getURL({ withRevision: true }) + '/save',
    data: data,
    type: 'post',
    dataType: 'json',
    headers: {'Accept': 'application/json'},
    success: function (data) {
      $document.trigger('saveComplete', { panelId: panelId });
      if (data.error) {
        saveCode('save', true, function () {
          // savedAlready = data.checksum;
        });
      } else {
        jsbin.state.latest = true;
      }
    },
    error: function (jqXHR) {
      onSaveError(jqXHR, panelId);
    },
    complete: function () {
      saving.inprogress(false);
      if (callback) { callback(); }
    }
  });
}

$('a.clone').click(clone);
$('#tip').delegate('a.clone', 'click', clone);

function clone(event) {
  event.preventDefault();

  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  analytics.clone();

  var $form = setupform('save,new');
  $form.submit();

  return false;
}

function setupform(method) {
var $form = $('form#saveform').empty()
    .append('<input type="hidden" name="javascript" />')
    .append('<input type="hidden" name="html" />')
    .append('<input type="hidden" name="css" />')
    .append('<input type="hidden" name="method" />')
    .append('<input type="hidden" name="_csrf" value="' + jsbin.state.token + '" />')
    .append('<input type="hidden" name="settings" />')
    .append('<input type="hidden" name="checksum" />');

  var settings = {};

  if (jsbin.state.processors) {
    settings.processors = jsbin.state.processors;
  }

  // this prevents new revisions forking off the welcome bin
  // because it's looking silly!
  if (jsbin.state.code === 'welcome') {
    $form.attr('action', '/save');
  }

  $form.find('input[name=settings]').val(JSON.stringify(settings));
  $form.find('input[name=javascript]').val(editors.javascript.getCode());
  $form.find('input[name=css]').val(editors.css.getCode());
  $form.find('input[name=html]').val(editors.html.getCode());
  $form.find('input[name=method]').val(method);
  $form.find('input[name=checksum]').val(jsbin.state.checksum);

  return $form;
}

function pad(n){
  return n<10 ? '0'+n : n;
}

function ISODateString(d){
  return d.getFullYear()+'-'
    + pad(d.getMonth()+1)+'-'
    + pad(d.getDate())+'T'
    + pad(d.getHours())+':'
    + pad(d.getMinutes())+':'
    + pad(d.getSeconds())+'Z';
}

function saveCode(method, ajax, ajaxCallback) {
  // create form and post to it
  var $form = setupform(method);
  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  jsbin.panels.saveOnExit = true;

  var data = $form.serializeArray().reduce(function(obj, data) {
    obj[data.name] = data.value;
    return obj;
  }, {});

  if (jsbin.settings.useCompression) {
    compressKeys('html,css,javascript', data);
  }

  if (ajax) {
    $.ajax({
      url: jsbin.getURL({ withRevision: true }) + '/save',
      data: data,
      dataType: 'json',
      type: 'post',
      headers: {'Accept': 'application/json'},
      success: function (data) {
        if (ajaxCallback) {
          ajaxCallback(data);
        }

        store.sessionStorage.setItem('checksum', data.checksum);
        saveChecksum = data.checksum;

        jsbin.state.checksum = saveChecksum;
        jsbin.state.code = data.code;
        jsbin.state.revision = data.revision;
        jsbin.state.latest = true; // this is never not true...end of conversation!
        jsbin.state.metadata = { name: jsbin.user.name };
        $form.attr('action', jsbin.getURL({ withRevision: true }) + '/save');

        if (window.history && window.history.pushState) {
          // updateURL(edit);
          var hash = panels.getHighlightLines();
          if (hash) { hash = '#' + hash; }
          var query = panels.getQuery();
          if (query) { query = '?' + query; }
          // If split is truthy (> 0) then we are using the revisonless feature
          // this is temporary until we release the feature!
          window.history.pushState(null, '', jsbin.getURL({withRevision: !split}) + '/edit' + query + hash);
          store.sessionStorage.setItem('url', jsbin.getURL({withRevision: !split}));
        } else {
          window.location.hash = data.edit;
        }

        $document.trigger('saved');
      },
      error: function (jqXHR) {
        onSaveError(jqXHR, null);
      },
      complete: function () {
        saving.inprogress(false);
      }
    });
  } else {
    $form.submit();
  }
}