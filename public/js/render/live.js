var $live = $('#live'),
    showlive = $('#showlive')[0],
    throttledPreview = throttle(renderLivePreview, 200),
    killAlerts = '<script>try{window.open=function(){};window.print=function(){};window.alert=function(){};window.prompt=function(){};window.confirm=function(){};}catch(e){}</script>',
    restoreAlerts = '<script>try{delete window.print;delete window.alert;delete window.prompt;delete window.confirm;delete window.open;}catch(e){}</script>',
    liveScrollTop = null;

var iframedelay = (function () {
  var iframedelay = { active : false },
      iframe = document.createElement('iframe'),
      doc,
      callbackName = '__callback' + (+new Date);

  iframe.style.height = iframe.style.width = '1px';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);
  doc = iframe.contentDocument || iframe.contentWindow.document;

  window[callbackName] = function (width) {
    iframedelay.active = width === 0;
    try {
      iframe.parentNode.removeChild(iframe);
      delete window[callbackName];
    } catch (e){};
  };

  try {
    doc.open();
    doc.write('<script>window.parent.' + callbackName + '(window.innerWidth)</script>');
    doc.close();
  } catch (e) {
    iframedelay.active = true;
  }

  return iframedelay;
}());

function sendReload() {
  if (saveChecksum) {
    $.ajax({
      url: jsbin.getURL() + '/reload',
      data: { 
        code: jsbin.state.code, 
        revision: jsbin.state.revision,
        checksum: saveChecksum
      },
      type: 'post'
    });
  }
}

var deferredLiveRender = null;

function codeChangeLive(event, data) {
  clearTimeout(deferredLiveRender);

  var editor,
      line,
      panel = jsbin.panels.panels.live;

  if (jsbin.panels.ready) {
    if (jsbin.settings.includejs === false && data.panelId === 'javascript') {
      // ignore
    } else if (panel.visible) {
      // test to see if they're write a while loop
      if (!jsbin.lameEditor && jsbin.panels.focused && jsbin.panels.focused.id === 'javascript') {
        // check the current line doesn't match a for or a while or a do - which could trip in to an infinite loop
        editor = jsbin.panels.focused.editor;
        line = editor.getLine(editor.getCursor().line);
        if (ignoreDuringLive.test(line) === true) {
          // ignore
          throttledPreview.cancel();
          deferredLiveRender = setTimeout(function () {
            codeChangeLive(event, data);
          }, 1000);
        } else {
          throttledPreview();
        }
      } else {
        throttledPreview();
      }
    }
  }
}

$document.bind('codeChange.live', codeChangeLive);


function two(s) {
  return (s+'').length < 2 ? '0' + s : s;
}

function renderLivePreview(withalerts) {
  var source = getPreparedCode(), //jsbin.panels.panels.console.visible),
      remove = $live.find('iframe').length > 0,
      $frame = $live.prepend('<iframe class="stretch" frameBorder="0"></iframe>').find('iframe:first'),
      frame = $frame[0],
      doc = frame.contentDocument || frame.contentWindow.document,
      win = doc.defaultView || doc.parentWindow,
      d = new Date(),
      combinedSource = [];

  // if (!useCustomConsole) console.log('--- refreshing live preview @ ' + [two(d.getHours()),two(d.getMinutes()),two(d.getSeconds())].join(':') + ' ---');

  if (withalerts !== true && jsbin.settings.includejs === false) {
    source = source.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  } else if (withalerts) {
    // send an update to the server that we ran the code
    sendReload();
  }

  // strip autofocus from the markup - prevents the focus switching out of the editable area
  source = source.replace(/(<.*?\s)(autofocus)/g, '$1');

  var run = function () {
    var jsbinConsole = jsbin.panels.panels.console.visible ? 'window.top._console' : false;

    // we're wrapping the whole thing in a try/catch in case the doc.write breaks the
    // execution and never reaches the point where it removes the previous iframe.
    try {
      doc.open();

      if (jsbin.settings.debug) {
        doc.write('<pre>' + source.replace(/[<>&]/g, function (m) {
          if (m == '<') return '&lt;';
          if (m == '>') return '&gt;';
          if (m == '"') return '&quot;';
        }) + '</pre>');
      } else {
        // nullify the blocking functions
        // IE requires that this is done in the script, rather than off the window object outside of the doc.write
        if (withalerts !== true) {
          combinedSource.push(killAlerts);
        } else {
          combinedSource.push(restoreAlerts);
        }

        if (jsbinConsole) {
          combinedSource.push('<script>(function(){window.addEventListener && window.addEventListener("error", function (event) { window.top._console.error({ message: event.message }, event.filename + ":" + event.lineno);}, false);}());</script>');

          // doc.write('<script>(function () { var fakeConsole = ' + jsbinConsole + '; if (console != undefined) { for (var k in fakeConsole) { console[k] = fakeConsole[k]; } } else { console = fakeConsole; } })(); window.onerror = function () { console.error.apply(console, arguments); }</script>');
        }

        // almost jQuery Mobile specific - when the page renders
        // it moves the focus over to the live preview - since
        // we no longer have a "render" panel, our code loses
        // focus which is damn annoying. So, I cancel the iframe
        // focus event...because I can :)
        var click = false;
        win.onmousedown = function () {
          click = true;
          setTimeout(function () {
            click = false;
          }, 10);
        };
        win.onfocus = function (event) {
          // allow the iframe to be clicked to create a fake focus
          if (click) {
            $('#live').focus();
            // also close any open dropdowns
            closedropdown();
          }
          return false;
        };

        win.onscroll = function () {
          liveScrollTop = this.scrollY;
        };

        win.resizeJSBin = throttle(function () {
          var height = ($body.outerHeight(true) - $frame.height()) + doc.documentElement.offsetHeight;
          window.parent.postMessage({ height: height }, '*');
        }, 20);

        combinedSource.push(source);
        combinedSource.push(restoreAlerts);
        // Only one doc.write. Fixes IE crashing bug.
        doc.write(combinedSource.join('\n'));

        if (liveScrollTop !== null) {
          win.scrollTo(0, liveScrollTop);
        }
      }
      doc.close();
      win.resizeJSBin();
      if (jsbin.embed) { // allow the iframe to be resized
        (function () {
          var dragging = false,
              height = false, 
              $window = $(win);
          $(doc.documentElement).mousedown(function (event) {
            if (event.pageY > $window.height() - 40) {
              dragging = event.pageY;
              height = $body.outerHeight();
            }
          }).mousemove(function (event) {
            if (dragging !== false) {
              window.parent.postMessage({ height: height + (event.pageY - dragging) }, '*');
            }
          }).mouseup(function () {
            dragging = false;
          });
        })();
      }
    } catch (e) {
      if (jsbinConsole) {
        window.top._console.error({ message: e.message }, e.filename + ":" + e.lineno);
      }
    }

    delete jsbin.panels.panels.live.doc;
    jsbin.panels.panels.live.doc = doc;

    // by removing the previous iframe /after/ the newly created live iframe
    // has run, it doesn't flicker - which fakes a smooth live update.
    if (remove) {
      $live.find('iframe:last').remove();
    }

    // if (jsbin.panels.panels.console.visible) {
    //   jsbin.panels.panels.console.render(); // now run the JS
    // }
  };

  // WebKit requires a wait time before actually writing to the iframe
  // annoyingly it's not consistent (I suspect WebKit is the buggy one)
  if (iframedelay.active) {
    // this setTimeout allows the iframe to be rendered before our code
    // runs - thus allowing us access to the innerWidth, et al
    setTimeout(run, 0);
  } else {
    run();
  }
}
