function allowDrop(holder) {
  var cursorPosition = null;
  var panel = null;
  var Promise = window.Promise || RSVP.Promise;

  var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return function() {
      return s4() + s4();
    };
  })();

  function uploadAsset(file) {
    var loading = document.createElement('div');
    loading.className = 'assetLoading';
    loading.innerHTML = '0% uploading...';
    var currentStatus = 0;

    var progress = function progress(percent, status) {
      if (percent - currentStatus < 10) {
        currentStatus = percent;
      } else {
        currentStatus += 10;
        requestAnimationFrame(function () {
          progress(percent, status);
        });
      }

      if (loading && currentStatus > 0) {
        if (currentStatus > 97) {
          loading.innerHTML = '97% uploaded...';
          // because there's some lag between 100% and actually rendering
        } else {
          loading.innerHTML = currentStatus + '% uploaded...';
        }
      }
    };

    var widget = null;
    var insertPosition = cursorPosition || panel.getCursor();
    if (!jsbin.lameEditor) {
      var line = cursorPosition ? cursorPosition.line : panel.getCursor().line;
      widget = panel.addLineWidget(line, loading, {coverGutter: false, nohscroll: true});
    } else {
      insertTextArea(panel, 'Uploading ...', true);
    }

    var s3upload = new S3Upload({
      s3_sign_put_url: '/account/assets/sign',
      s3_object_name: file.name.replace(/\s+/g, '-'),
      files: [file],

      onProgress: function (percent, status) {
        if (!jsbin.lameEditor) {
          requestAnimationFrame(function () {
            progress(percent, status);
          });
        }
      },

      onError: function (reason, fromServer) {
        currentStatus = -1;
        console.error('Failed to upload: ' + fromServer);
        loading.innerHTML = fromServer || 'Failed to complete';
        loading.style.color = 'red';
        panel = null;
        cursorPosition = null;
        if (widget) {
          setTimeout(function () {
            widget.clear();
          }, 4000);
        }
      },

      onFinishS3Put: function (url) {
        if (!jsbin.lameEditor) {
          widget.clear();
          panel.replaceRange(getInsertText(file.type, panel, url), insertPosition);
        } else {
          insertTextArea(panel, getInsertText(file.type, panel, url));
          $(document).trigger('codeChange', { panelId: panel.id });
        }
        panel = null;
        cursorPosition = null;
      }
    });
  }

  function insertTextArea(el, string, select) {
    var start = el.selectionStart;
    var end = el.selectionEnd;

    var target = el;
    var value = target.value;

    // set textarea value to: text before caret + tab + text after caret
    target.value = value.substring(0, start) + string + value.substring(end);

    // put caret at right position again (add one for the tab)
    el.selectionStart = el.selectionEnd = start + 1;

    if (select) {
      el.selectionStart -= 1;
      el.selectionEnd = el.selectionEnd + string.length;
    } else {
      el.selectionStart = el.selectionEnd = start + string.length;
    }
  }

  function getInsertText(mime, cm, url) {
    // var panel = jsbin.panels.panels[cm.id];
    var processor = jsbin.state.processors[cm.id];

    if (cm.id === 'html') {
      if (mime.indexOf('image/') === 0) {
        if (processor === 'markdown') {
          return '![' + url + '](' + url + ')';
        }

        if (processor === 'jade') {
          return 'img(src="' + url + '")';
        }

        return '<img src="' + url + '">';
      }

      return url;
    }

    if (cm.id === 'css') {
      if (mime.indexOf('image/') === 0) {
        return 'url(' + url + ')';
      }

      return url;
    }

    // note: js just gets the url...
    return url;
  }

  var dragging = false;

  holder.ondragover = function () {
    dragging = true;
    return false;
  };

  holder.ondragend = function () {
    dragging = false;
    return false;
  };

  function getFileData(item) {
    return new Promise(function (resolve, reject) {
      if (item.kind === 'string') {
        item.getAsString(function (filename) {
          resolve(filename);
        });
      } else {
        resolve(item.getAsFile());
      }
    });
  }

  $('#bin textarea').on('paste', function (jQueryEvent) {
    if ($(this).closest('.CodeMirror').length) {
      panel = $(this).closest('.CodeMirror')[0].CodeMirror;
    } else {
      panel = this;
    }

    var event = jQueryEvent.originalEvent;
    var items = event.clipboardData.items;

    // this means we've copied a file that's an app icon, or it's just text
    // which we don't want to kick in anyway.
    if (!items || event.clipboardData.types[0].indexOf('text/') === 0) {
      return;
    }

    var file = null;
    var promises = [];
    for (var i = 0; i < items.length; i++) {
      promises.push(getFileData(items[i]));
    }

    Promise.all(promises).then(function (data) {
      var blobname = data.sort(function (a, b) {
        return typeof a === 'string' ? 1 : -1;
      });
      var file = data[0];
      file.name = data[1] || guid() + '.' + file.type.split('/')[1];

      uploadAsset(file);
    }).catch(function (error) {
      console.log(error.stack);
    });

    // FIXME???
    jQueryEvent.preventDefault();
  });

  $('.CodeMirror').on('mousemove', function (e) {
    if (!dragging) {
      return;
    }

    panel = this.CodeMirror;
    cursorPosition = this.CodeMirror.coordsChar({ top: event.y, left: event.x });
    this.CodeMirror.setCursor(cursorPosition);
  });

  var jstypes = ['javascript', 'coffeescript', 'coffee', 'js'];
  var csstypes = ['css', 'less', 'sass', 'scss'];
  var htmltypes = ['html', 'markdown', 'plain'];

  holder.ondrop = function (e) {
    dragging = false;
    e.preventDefault();

    if ($(e.target).closest('.CodeMirror').length) {
      panel = $(e.target).closest('.CodeMirror')[0].CodeMirror;
    } else {
      panel = e.target;
    }

    var file = e.dataTransfer.files[0],
        reader = new FileReader();

    if (file.type.indexOf('text/') !== 0) {
      // this isn't a text file for populating the panel, try uploading instead
      uploadAsset(file);
      return;
    }

    reader.onload = function (event) {
      // put JS in the JavaScript panel
      var type = file.type ? file.type.toLowerCase().replace(/^(text|application)\//, '') : file.name.toLowerCase().replace(/.*\./g, ''),
          panelId = null,
          panel = editors[panelId],
          syncCode = event.target.result,
          scroller = null;

      if (jstypes.indexOf(type) !== -1) {
        panelId = 'javascript';
      } else if (csstypes.indexOf(type) !== -1) {
        panelId = 'css';
      } else if (htmltypes.indexOf(type) !== -1) {
        panelId = 'html';
      }

      if (panelId === null) {
        // then we have an asset upload
        return uploadAsset(file);
      }

      panel = editors[panelId];
      scroller = panel.editor.scroller;

      panel.setCode(event.target.result);
      panel.show();

      try {
        // now kick off - basically just doing a copy and paste job from @wookiehangover - thanks man! :)
        var worker = new Worker(jsbin['static'] + '/js/editors/sync-worker.js');

        // pass the worker the file object
        worker.postMessage(file);

        panel.$el.find('> .label').append('<small> (live: edit & save in your fav editor)</small>');

        // bind onmessage handler
        worker.onmessage = function (event) {
          var top = scroller.scrollTop;
          panel.setCode(event.data.body);
          scroller.scrollTop = top;
          syncCode = event.data.body;
        };
      } catch (e) {
        // fail on the awesomeness...oh well
      }
    };

    reader.readAsText(file);

    return false;
  };
}

// test for dnd and file api first
if (!!(window.File && window.FileList && window.FileReader)) allowDrop(document.body);
