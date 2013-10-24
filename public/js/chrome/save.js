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
      var panels = ['html','css','javascript'],
          todo;

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

// to allow for download button to be introduced via beta feature
$('a.save').click(function (event) {
  event.preventDefault();

  analytics.milestone();
  // if save is disabled, hitting save will trigger a reload
  saveCode('save', jsbin.saveDisabled === true ? false : true);

  return false;
});

var $shareLinks = $('#share .link');

$panelCheckboxes = $('#sharemenu #sharepanels input');

function updateSavedState() {
  var mapping = {
    live: 'output',
    javascript: 'js',
    css: 'css',
    html: 'html',
    console: 'console'
  };
  var query = $panelCheckboxes.filter(':checked').map(function () {
    return mapping[this.getAttribute('data-panel')];
  }).get().join(',');
  $shareLinks.each(function () {
    var url = jsbin.getURL() + this.getAttribute('data-path') + (query && this.id !== 'livepreview' ? '?' + query : ''),
        nodeName = this.nodeName;
    if (nodeName === 'A') {
      this.href = url;
    } else if (nodeName === 'INPUT') {
      this.value = url;
    } else if (nodeName === 'TEXTAREA') {
      this.value = ('<a class="jsbin-embed" href="' + url + '">' + documentTitle + '</a><' + 'script src="' + jsbin.static + '/js/embed.js"><' + '/script>').replace(/<>"&/g, function (m) {
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

$('#sharemenu').bind('open', function () {
  updateSavedState();
});

$document.on('saved', function () {
  updateSavedState();
  $shareLinks.closest('.menu').removeClass('hidden');

  $('#jsbinurl').attr('href', jsbin.getURL()).removeClass('hidden');
  $('#clone').removeClass('hidden');
});

var saveChecksum = jsbin.state.checksum || sessionStorage.getItem('checksum') || false;

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

// TODO decide whether to expose this code, it disables live saving for IE users
// until they refresh - via a great big yellow button. For now this is hidden
// in favour of the nasty hash hack.
if (false) { // !saveChecksum && !history.pushState) {
  jsbin.saveDisabled = true;

  $document.bind('jsbinReady', function () {
    $document.one('codeChange', function () {
      $('#start-saving').css('display', 'inline-block');
    });
  });
}

function onSaveError(jqXHR, panelId) {
  if (jqXHR.status === 413) {
    // Hijack the tip label to show an error message.
    $('#tip p').html('Sorry this bin is too large for us to save');
    $(document.documentElement).addClass('showtip');
  } else {
    if (panelId) savingLabels[panelId].text('Saving...').animate({ opacity: 1 }, 100);
    window._console.error({message: 'Warning: Something went wrong while saving. Your most recent work is not saved.'});
    // $document.trigger('tip', {
    //   type: 'error',
    //   content: 'Something went wrong while saving. Your most recent work is not saved.'
    // });
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
    jsbin.panels.allEditors(function (panel) {
      panel.on('processor', function () {
        // if the url doesn't match the root - i.e. they've actually saved something then save on processor change
        if (jsbin.root !== jsbin.getURL()) {
          $document.trigger('codeChange', [{ panelId: panel.id }]);
        }
      });
    });

    $document.bind('codeChange', function (event, data) {
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
      if (!data.panelId) return;

      var panelId = data.panelId;

      if (saving.inprogress()) {
        // queue up the request and wait
        saving.todo[panelId] = true;
        return;
      }

      saving.inprogress(true);

      if (!saveChecksum) {
        // create the bin and when the response comes back update the url
        saveCode('save', true);
      } else {
        updateCode(panelId);
      }
    }, 250));
  });
}

function updateCode(panelId, callback) {
  var panelSettings = {};

  if (jsbin.state.processors) {
    panelSettings.processors = jsbin.state.processors;
  }

  $.ajax({
    url: jsbin.getURL() + '/save',
    data: {
      code: jsbin.state.code,
      revision: jsbin.state.revision,
      method: 'update',
      panel: panelId,
      content: editors[panelId].getCode(),
      checksum: saveChecksum,
      settings: JSON.stringify(panelSettings)
    },
    type: 'post',
    dataType: 'json',
    headers: {'Accept': 'application/json'},
    success: function (data) {
      $document.trigger('saveComplete', { panelId: panelId });
      if (data.error) {
        saveCode('save', true, function (data) {
          // savedAlready = data.checksum;
        });
      }
    },
    error: function (jqXHR) {
      onSaveError(jqXHR, panelId);
    },
    complete: function () {
      saving.inprogress(false);
      callback && callback();
    }
  });
}

$('a.clone').click(function (event) {
  event.preventDefault();

  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  analytics.clone();

  var $form = setupform('save,new');
  $form.submit();

  return false;
});

function setupform(method) {
var $form = $('form#saveform').empty()
    .append('<input type="hidden" name="javascript" />')
    .append('<input type="hidden" name="html" />')
    .append('<input type="hidden" name="css" />')
    .append('<input type="hidden" name="method" />')
    .append('<input type="hidden" name="_csrf" value="' + jsbin.state.token + '" />')
    .append('<input type="hidden" name="settings" />');

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

  return $form;
}

function pad(n){
  return n<10 ? '0'+n : n
}

function ISODateString(d){
  return d.getFullYear()+'-'
    + pad(d.getMonth()+1)+'-'
    + pad(d.getDate())+'T'
    + pad(d.getHours())+':'
    + pad(d.getMinutes())+':'
    + pad(d.getSeconds())+'Z'
}

function saveCode(method, ajax, ajaxCallback) {
  // create form and post to it
  var $form = setupform(method);
  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  jsbin.panels.saveOnExit = true;

  if (ajax) {
    $.ajax({
      url: $form.attr('action'),
      data: $form.serialize(),
      dataType: 'json',
      type: 'post',
      headers: {'Accept': 'application/json'},
      success: function (data) {
        var $binGroup,
            edit;

        $form.attr('action', data.url + '/save');
        ajaxCallback && ajaxCallback(data);

        sessionStorage.setItem('checksum', data.checksum);
        saveChecksum = data.checksum;

        jsbin.state.code = data.code;
        jsbin.state.revision = data.revision;

        // getURL(true) gets the jsbin without the root attached
        $binGroup = $('#history tr[data-url="' + jsbin.getURL(true) + '"]');
        edit = data.edit.replace(location.protocol + '//' + window.location.host, '') + window.location.search;
        $binGroup.find('td.url a span.first').removeClass('first');
        $binGroup.before('<tr data-url="' + data.url + '/" data-edit-url="' + edit + '"><td class="url"><a href="' + edit + '?live"><span class="first">' + data.code + '/</span>' + data.revision + '/</a></td><td class="created"><a href="' + edit + '" pubdate="' + data.created + '">Just now</a></td><td class="title"><a href="' + edit + '">' + data.title + '</a></td></tr>');

        $document.trigger('saved');

        if (window.history && window.history.pushState) {
          // updateURL(edit);
          window.history.pushState(null, '', jsbin.getURL() + '/edit');
          sessionStorage.setItem('url', jsbin.getURL());
        } else {
          window.location.hash = data.edit;
        }
      },
      error: function (jqXHR) {
        onSaveError(jqXHR);
      },
      complete: function () {
        saving.inprogress(false);
      }
    });
  } else {
    $form.submit();
  }
}

/**
 * Returns the similar part of two strings
 * @param  {String} a first string
 * @param  {String} b second string
 * @return {String}   common substring
 */
function sameStart(a, b) {
  if (a == b) return a;

  var tmp = b.slice(0, 1);
  while (a.indexOf(b.slice(0, tmp.length + 1)) === 0) {
    tmp = b.slice(0, tmp.length + 1);
  }

  return tmp;
}

/*

// refresh the window when we popstate, because for now we don't do an xhr to
// inject the panel content...yet.
window.onpopstate = function onpopstate(event) {
  // ignore the first popstate event, because that comes from the browser...
  if (!onpopstate.first) window.location.reload();
  else onpopstate.first = false;
};

onpopstate.first = true;

function updateURL(path) {
  var old = location.pathname,
      back = true,
      same = sameStart(old, path);
      sameAt = same.length;

  if (updateURL.timer) window.cancelAnimationFrame(updateURL.timer);

  var run = function () {
    if (location.pathname !== path) {
      updateURL.timer = window.requestAnimationFrame(run);
    }

    if (location.pathname !== same) {
      if (back) {
        history.replaceState({ path: path }, '', location.pathname.slice(0, -1));
      } else {
        history.replaceState({ path: path }, '', path.slice(0, location.pathname.length + 1));
      }
    } else {
      back = false;
      history.replaceState({ path: path }, '', path.slice(0, sameAt + 2));
    }
  };

  history.pushState({ path: path }, '', location.pathname.slice(0, -1));

  run();
}

*/