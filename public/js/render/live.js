var $live = $('#live'),
    showlive = $('#showlive')[0];

/**
 * Defer callable. Kinda tricky to explain. Basically:
 *  "Don't make newFn callable until I tell you via this trigger callback."
 *
 * Example:

      // Only start logging after 3 seconds
      var log = function (str) { console.log(str); };
      var deferredLog = deferCallable(log, function (done) {
        setTimeout(done, 3000);
      });

      setInterval(function () {
        deferredLog(Date.now(), 500);
      });

 */
var deferCallable = function (newFn, trigger) {
  var args,
      pointerFn = function () {
        // Initially, the pointer basically does nothing, waiting for the
        // trigger to fire, but we save the arguments that wrapper was called
        // with so that they can be passed to the newFn when it's ready.
        args = [].slice.call(arguments);
      };

  // Immediately call the trigger so that the user can inform us of when
  // the newFn is callable.
  // When it is, swap round the pointers and, if the wrapper was aleady called,
  // immediately call the pointerFn.
  trigger(function () {
    pointerFn = newFn;
    if (args) {
      pointerFn.apply(null, args);
    }
  });

  // Wrapper the pointer function. This means we can swap pointerFn around
  // without breaking external references.
  return function wrapper() {
    return pointerFn.apply(null, [].slice.call(arguments));
  };
};

/**
 * =============================================================================
 * =============================================================================
 * =============================================================================
 */

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
          deferredLiveRender = setTimeout(function () {
            codeChangeLive(event, data);
          }, 1000);
        } else {
          renderLivePreview();
        }
      } else {
        renderLivePreview();
      }
    }
  }
}

/** ============================================================================
 * JS Bin Renderer
 * Messages to and from the runner.
 * ========================================================================== */

var renderer = (function () {

  var renderer = {};

  /**
   * Store what runner origin *should* be
   * TODO this should allow anything if x-origin protection should be disabled
   */
  renderer.runner = {};
  renderer.runner.origin = '*';

  /**
   * Setup the renderer
   */
  renderer.setup = function (runnerFrame) {
    renderer.runner.window = runnerFrame.contentWindow;
    renderer.runner.iframe = runnerFrame;
  };

  /**
   * Log error messages, indicating that it's from the renderer.
   */
  renderer.error = function () {
    // it's quite likely that the error that fires on this handler actually comes
    // from another service on the page, like a browser plugin, which we can
    // safely ignore.
    window.console.warn.apply(console, ['Renderer:'].concat([].slice.call(arguments)));
  };

  /**
   * Handle all incoming postMessages to the renderer
   */
  renderer.handleMessage = function (event) {
    if (!event.origin) return;
    var data = event.data;

    // specific change to handle reveal embedding
    try {
      if (event.data.indexOf('slide:') === 0 || event.data === 'jsbin:refresh') {
        // reset the state of the panel visibility
        jsbin.panels.allEditors(function (p) {
          p.visible = false;
        });
        jsbin.panels.restore();
        return;
      }
    } catch (e) {}

    try {
      data = JSON.parse(event.data);
    } catch (e) {
      return renderer.error('Error parsing event data:', e.message);
    }
    if (typeof renderer[data.type] !== 'function') {
      return renderer.error('No matching event handler:', data.type);
    }
    try {
      renderer[data.type](data.data);
    } catch (e) {
      renderer.error(e.message);
    }
  };

  /**
   * Send message to the runner window
   */
  renderer.postMessage = function (type, data) {
    if (!renderer.runner.window) {
      return renderer.error('postMessage: No connection to runner window.');
    }
    renderer.runner.window.postMessage(JSON.stringify({
      type: type,
      data: data
    }), renderer.runner.origin);
  };

  /**
   * When the renderer is complete, it means we didn't hit an initial
   * infinite loop
   */
  renderer.complete = function () {
    try {
      store.sessionStorage.removeItem('runnerPending');
    } catch (e) {}
  };

  /**
   * Pass loop protection hit calls up to the error UI
   */
  renderer.loopProtectHit = function (line) {
    var cm = jsbin.panels.panels.javascript.editor;

    // grr - more setTimeouts to the rescue. We need this to go in *after*
    // jshint does it's magic, but jshint set on a setTimeout, so we have to
    // schedule after.
    setTimeout(function () {
      var annotations = cm.state.lint.annotations || [];
      if (typeof cm.updateLinting !== 'undefined') {
        // note: this just updated the *source* reference
        annotations = annotations.filter(function (a) {
          return a.source !== 'loopProtectLine:' + line;
        });
        annotations.push({
          from: CodeMirror.Pos(line-1, 0),
          to: CodeMirror.Pos(line-1, 0),
          message: 'Exiting potential infinite loop.\nTo disable loop protection: add "// noprotect" to your code',
          severity: 'warning',
          source: 'loopProtectLine:' + line
        });

        cm.updateLinting(annotations);
      }
    }, cm.state.lint.options.delay || 0);
  };

  /**
   * When the iframe resizes, update the size text
   */
  renderer.resize = (function () {
    var size = $live.find('.size');

    var hide = throttle(function () {
      size.fadeOut(200);
    }, 2000);

    var embedResizeDone = false;

    return function (data) {
      if (!jsbin.embed) {
        // Display the iframe size in px in the JS Bin UI
        size.show().html(data.width + 'px');
        hide();
      }
      if (jsbin.embed && self !== top && embedResizeDone === false) {
        embedResizeDone = true;
        // Inform the outer page of a size change
        var height = ($body.outerHeight(true) - $(renderer.runner.iframe).height()) + data.offsetHeight;
       window.parent.postMessage({ height: height }, '*');
      }
    };
  }());

  /**
   * When the iframe focuses, simulate that here
   */
  renderer.focus = function () {
    jsbin.panels.focus(jsbin.panels.panels.live);
    // also close any open dropdowns
    closedropdown();
  };

  /**
   * Proxy console logging to JS Bin's console
   */
  renderer.console = function (data) {
    var method = data.method,
        args = data.args;

    if (!window._console) {return;}
    if (!window._console[method]) {method = 'log';}

    // skip the entire console rendering if the console is hidden
    if (!jsbin.panels.panels.console.visible) { return; }

    window._console[method].apply(window._console, args);
  };

  /**
   * Load scripts into rendered iframe
   */
  renderer['console:load:script:success'] = function (url) {
    $document.trigger('console:load:script:success', url);
  };

  renderer['console:load:script:error'] = function (err) {
    $document.trigger('console:load:script:error', err);
  };

  /**
   * Load DOME into rendered iframe
   * TODO abstract these so that they are automatically triggered
   */
  renderer['console:load:dom:success'] = function (url) {
    $document.trigger('console:load:dom:success', url);
  };

  renderer['console:load:dom:error'] = function (err) {
    $document.trigger('console:load:dom:error', err);
  };

  return renderer;

}());

/** ============================================================================
 * Live rendering.
 *
 * Comes in two tasty flavours. Basic mode, which is essentially an IE7
 * fallback. Take a look at https://github.com/jsbin/jsbin/issues/651 for more.
 * It uses the iframe's name and JS Bin's event-stream support to keep the
 * page up-to-date.
 *
 * The second mode uses postMessage to inform the runner of changes to code,
 * config and anything that affects rendering, and also listens for messages
 * coming back to update the JS Bin UI.
 * ========================================================================== */

/**
 * Render live preview.
 * Create the runner iframe, and if postMe wait until the iframe is loaded to
 * start postMessaging the runner.
 */
var renderLivePreview = (function () {

  // Runner iframe
  var iframe;

  // Basic mode
  // This adds the runner iframe to the page. It's only run once.
  if (!$live.find('iframe').length) {
    iframe = document.createElement('iframe');
    iframe.setAttribute('class', 'stretch');
    iframe.setAttribute('sandbox', 'allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts');
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('name', '<proxy>');
    $live.prepend(iframe);
    iframe.src = jsbin.runner;
    try {
      iframe.contentWindow.name = '/' + jsbin.state.code + '/' + jsbin.state.revision;
    } catch (e) {
      // ^- this shouldn't really fail, but if we're honest, it's a fucking mystery as to why it even works.
      // problem is: if this throws (because iframe.contentWindow is undefined), then the execution exits
      // and `var renderLivePreview` is set to undefined. The knock on effect is that the calls to renderLivePreview
      // then fail, and jsbin doesn't boot up. Tears all round, so we catch.
    }
  }

  // The big daddy that handles postmessaging the runner.
  var renderLivePreview = function (requested) {
    // No postMessage? Don't render – the event-stream will handle it.
    if (!window.postMessage) { return; }

    // Inform other pages event streaming render to reload
    if (requested) {
      sendReload();
      jsbin.state.hasBody = false;
    }
    getPreparedCode().then(function (source) {
      var includeJsInRealtime = jsbin.settings.includejs;

      // Tell the iframe to reload
      var visiblePanels = jsbin.panels.getVisible();
      var outputPanelOpen = visiblePanels.indexOf(jsbin.panels.panels.live) > -1;
      var consolePanelOpen = visiblePanels.indexOf(jsbin.panels.panels.console) > -1;
      if (!outputPanelOpen && !consolePanelOpen) {
        return;
      }
      // this is a flag that helps detect crashed runners
      if (jsbin.settings.includejs) {
        store.sessionStorage.setItem('runnerPending', 1);
      }

      renderer.postMessage('render', {
        source: source,
        options: {
          injectCSS: jsbin.state.hasBody && jsbin.panels.focused.id === 'css',
          requested: requested,
          debug: jsbin.settings.debug,
          includeJsInRealtime: jsbin.settings.includejs,
        },
      });

      jsbin.state.hasBody = true;

    });
  };

  /**
   * Events
   */

  $document.on('codeChange.live', function (event, arg) {
    if (arg.origin === 'setValue' || arg.origin === undefined) {
      return;
    }
    store.sessionStorage.removeItem('runnerPending');
  });

  // Listen for console input and post it to the iframe
  $document.on('console:run', function (event, cmd) {
    renderer.postMessage('console:run', cmd);
  });

  $document.on('console:load:script', function (event, url) {
    renderer.postMessage('console:load:script', url);
  });

  $document.on('console:load:dom', function (event, html) {
    renderer.postMessage('console:load:dom', html);
  });

  // When the iframe loads, swap round the callbacks and immediately invoke
  // if renderLivePreview was called already.
  return deferCallable(throttle(renderLivePreview, 200), function (done) {
    iframe.onload = function () {
      if (window.postMessage) {
        // Setup postMessage listening to the runner
        $window.on('message', function (event) {
          renderer.handleMessage(event.originalEvent);
        });
        renderer.setup(iframe);
      }
      done();
    };
  });

}());


// this needs to be after renderLivePreview is set (as it's defined using
// var instead of a first class function).
var liveScrollTop = null;

// timer value: used in the delayed render (because iframes don't have
// innerHeight/Width) in Chrome & WebKit
var deferredLiveRender = null;

$document.bind('codeChange.live', codeChangeLive);
