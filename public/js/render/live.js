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
    liveScrollTop = null;

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
  renderer.runner.origin = jsbin.root.replace('jsbin', 'run.jsbin');

  /**
   * Setup the renderer
   */
  renderer.setup = function (runner) {
    renderer.runner.window = runner;
  };

  /**
   * Log error messages, indicating that it's from the renderer.
   */
  renderer.error = function () {
    window.console.error.apply(console, ['Renderer:'].concat([].slice.call(arguments)));
  };

  /**
   * Handle all incoming postMessages to the renderer
   */
  renderer.handleMessage = function (event) {
    if (event.origin !== renderer.runner.origin) {
      return renderer.error('Message disallowed, incorrect origin:', event.origin);
    }
    if (typeof renderer[event.data.type] !== 'function') {
      return renderer.error('No matching event handler:', event.data.type);
    }
    try {
      renderer[event.data.type](event.data.data);
    } catch (e) {
      renderer.error(e.message);
    }
  };

  /**
   * Send message to the runner window
   */
  renderer.postMessage = function (type, data) {
    if (!renderer.runner.window) {
      return renderer.error('No connection to runner window.');
    }
    renderer.runner.window.postMessage({
      type: type,
      data: data
    }, renderer.runner.origin);
  };

  /**
   * When the iframe resizes, update the size text
   */
  renderer.resize = (function () {
    var size = $live.find('.size');

    var hide = throttle(function () {
      size.fadeOut(200);
    }, 2000);

    return function (data) {
      if (!jsbin.embed) {
        size.show().html(data.width + 'px');
        hide();
      }
    };
  }());

  return renderer;

}());

/** ============================================================================
 * Live rendering.
 *
 * Comes in to tasty flavours. Basic mode, which is essentially an IE7
 * fallback. Take a look at https://github.com/remy/jsbin/issues/651 for more.
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
    iframe.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts');
    // TODO update this so that it's environment agnostic
    iframe.src = jsbin.root.replace('jsbin', 'run.jsbin') + '/runner';
    $live.prepend(iframe);
    iframe.contentWindow.name = '/' + jsbin.state.code + '/' + jsbin.state.revision;
  }

  // The big daddy that handles postmessaging the runner.
  var renderLivePreview = function (requested) {
    // No postMessage? Don't render – the event-stream will handle it.
    if (!window.postMessage) return;

    var source = getPreparedCode();
    renderer.postMessage('render', {
      source: source,
      options: {
        requested: requested,
        debug: jsbin.settings.debug,
        includeJsInRealtime: jsbin.settings.includejs
      }
    });
  };

  // When the iframe loads, swap round the callbacks and immediately invoke
  // if renderLivePreview was called already.
  return deferCallable(renderLivePreview, function (done) {
    iframe.onload = function () {
      if (window.postMessage) {
        // Setup postMessage listening to the runner
        window.addEventListener('message', renderer.handleMessage, false);
        renderer.setup(iframe.contentWindow);
      }
      done();
    };
  });

}());

