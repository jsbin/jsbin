function tryToRender() {
  // TODO re-enable this code. It's been disabled for now because it
  // only works to detect infinite loops in very simple situations.
  // what it needs is a few polyfills in the worker for DOM API
  // and probably canvas API.
  if (false && window.Worker) {
    // this code creates a web worker, and if it doesn't complete the
    // execution inside of 100ms, it'll return false suggesting there may
    // be an infinite loop
    testForHang(function (ok) {
      if (ok) {
        renderLivePreview();
      }
    });
  } else {
    renderLivePreview();
  }
}

var $live = $('#live'),
    showlive = $('#showlive')[0],
    throttledPreview = throttle(tryToRender, 200),
    killAlerts = '<script>try{window.open=function(){};window.print=function(){};window.alert=function(){};window.prompt=function(){};window.confirm=function(){};}catch(e){}</script>',
    restoreAlerts = '<script>try{delete window.print;delete window.alert;delete window.prompt;delete window.confirm;delete window.open;}catch(e){}</script>',
    liveScrollTop = null;

/**
 * Grab the doctype from a string.
 *
 * Returns an object with doctype and tail keys.
 */
var getDoctype = (function () {
  // Cached regex
  // [\s\S] matches multiline doctypes
  var regex = /<!doctype [\s\S]*?>/i;
  return function (str) {
    var doctype = (str.match(regex) || [''])[0],
        tail = str.substr(doctype.length);
    return {
      doctype: doctype,
      tail: tail
    };
  };
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

  /**
   * Live rendering, basic mode.
   * IE7 fallback. See https://github.com/remy/jsbin/issues/651.
   */
  if ($live.find('iframe').length) return;
  var iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts');
  // TODO update this so that it's environment agnostic
  iframe.src = "http://run.jsbin.dev:3003/runner";
  $live.prepend(iframe);
  iframe.contentWindow.name = '/' + jsbin.state.code + '/' + jsbin.state.revision;

  return;

  /**
   * =============================================================================
   */

  var source = getPreparedCode(), //jsbin.panels.panels.console.visible),
      remove = $live.find('iframe').length > 0,
      $frame = $live.prepend('<iframe class="stretch" frameBorder="0" ></iframe>').find('iframe:first'),
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
    var jsbinConsole = jsbin.panels.panels.console.visible ? 'window.jsbinWindow._console' : false;

    // we're wrapping the whole thing in a try/catch in case the doc.write breaks the
    // execution and never reaches the point where it removes the previous iframe.
    try {
      doc.open();

      if (jsbin.settings.debug) {
        window._console.info('Rendering source in debug mode');
        doc.write('<pre>' + source.replace(/[<>&]/g, function (m) {
          if (m == '<') return '&lt;';
          if (m == '>') return '&gt;';
          if (m == '"') return '&quot;';
        }) + '</pre>');
      } else {

        // Make sure the doctype is the first thing in the source
        var doctypeObj = getDoctype(source),
            doctype = doctypeObj.doctype;
        source = doctypeObj.tail;
        combinedSource.push(doctype);

        // nullify the blocking functions
        // IE requires that this is done in the script, rather than off the window object outside of the doc.write
        if (withalerts !== true) {
          combinedSource.push(killAlerts);
        } else {
          combinedSource.push(restoreAlerts);
        }

        if (jsbinConsole) {
          combinedSource.push('<script>(function(){window.addEventListener && window.addEventListener("error", function (event) { window.jsbinWindow._console.error({ message: event.message }, event.filename + ":" + event.lineno);}, false);}());</script>');

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

        var size = $live.find('.size'),
            timer = null;

        var hide = throttle(function () {
          size.fadeOut(200);
        }, 2000);
        $(win).on('resize', function () {
          // clearTimeout(timer);
          if (!jsbin.embed) {
            size.show().html(this.innerWidth + 'px');
            hide();
          }
        });

        win.resizeJSBin = throttle(function () {
          var height = ($body.outerHeight(true) - $frame.height()) + doc.documentElement.offsetHeight;
          window.parent.postMessage({ height: height }, '*');
        }, 20);

        // ensures that the console from the iframe has access to the right context
        win.jsbinWindow = window;

        combinedSource.push(source);
        combinedSource.push(restoreAlerts);
        // Only one doc.write. Fixes IE crashing bug.
        doc.write(combinedSource.join('\n'));

        if (liveScrollTop !== null) {
          win.scrollTo(0, liveScrollTop);
        }
      }
      doc.close();

      if (jsbin.embed) { // allow the iframe to be resized
        if (!jsbin.settings.debug) {
          win.resizeJSBin();
        }

        // super unknown code that allows the user to *sometimes, if they're lucky*
        // resize the iframe by dragging the bottom of the frame. Mr Sharp, me thinks
        // you're being too clever for your own good.
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
        window._console.error({ message: e.message }, e.filename + ":" + e.lineno);
      }
    }

    // Swap round the live panel's reference to the current document
    delete jsbin.panels.panels.live.doc;
    jsbin.panels.panels.live.doc = doc;

    // by removing the previous iframe /after/ the newly created live iframe
    // has run, it doesn't flicker - which fakes a smooth live update.
    if (remove) {
      $live.find('iframe:last').remove();
    }
  };

  // setTimeout allows the iframe to be rendered before our code runs, allowing
  // us access to the calculated properties like innerWidth.
  setTimeout(run, 0);
}
