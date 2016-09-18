/** ============================================================================
 * Sandbox
 * Handles creating and insertion of dynamic iframes
 * ========================================================================== */

var sandbox = (function () {

  var sandbox = {};

  /**
   * Save the target container element, plus the old and active iframes.
   */
  sandbox.target = null;
  sandbox.old = null;
  sandbox.active = null;
  sandbox.guid = +new Date(); // id used to keep track of which iframe is active

  /**
   * Create a new sandboxed iframe.
   */
  sandbox.create = function () {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts');
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('name', 'JS Bin Output ');
    iframe.id = sandbox.guid++;
    return iframe;
  };

  /**
   * Add a new iframe to the page and wait until it has loaded to call the
   * requester back. Also wait until the new iframe has loaded before removing
   * the old one.
   */
  sandbox.use = function (iframe, done) {
    if (!sandbox.target) throw new Error('Sandbox has no target element.');
    sandbox.old = sandbox.active;
    var state = sandbox.saveState(sandbox.old);
    sandbox.active = iframe;
    prependChild(sandbox.target, iframe);
    // setTimeout allows the iframe to be rendered before other code runs,
    // allowing us access to the calculated properties like innerWidth.
    setTimeout(function () {
      // call the code that renders the iframe source
      if (done) done();

      // remove *all* the iframes, baring the active one
      var iframes = sandbox.target.getElementsByTagName('iframe'),
          length = iframes.length,
          i = 0,
          id = sandbox.active.id,
          iframe;

      for (; iframe = iframes[i], i < length; i++) {
        if (iframe.id !== id) {
          iframe.parentNode.removeChild(iframe);
          length--;
        }
      }
    }, 0);
  };

  /**
   * Restore the state of a prvious iframe, like scroll position.
   */
  sandbox.restoreState = function (iframe, state) {
    if (!iframe) return {};
    var win = getIframeWindow(iframe);
    if (!win) return {};
    if (state.scroll) {
      win.scrollTo(state.scroll.x, state.scroll.y);
    }
  };

  /**
   * Save the state of an iframe, like scroll position.
   */
  sandbox.saveState = function (iframe) {
    if (!iframe) return {};
    var win = getIframeWindow(iframe);
    if (!win) return {};
    return {
      scroll: {
        x: win.scrollX,
        y: win.scrollY
      }
    };
  };

  /**
   * Attach event listeners and rpevent some default behaviour on the new
   * window during live rendering.
   */
  sandbox.wrap = function (childWindow, options) {
    if (!childWindow) return;
    options = options || {};

    // Notify the parent of resize events (and send one straight away)
    addEvent(childWindow, 'resize', throttle(function () {
      runner.postMessage('resize', sandbox.getSizeProperties(childWindow));
    }, 25));

    runner.postMessage('resize', sandbox.getSizeProperties(childWindow));

    // Notify the parent of a focus
    addEvent(childWindow, 'focus', function () {
      runner.postMessage('focus');
    });

  };

  sandbox.getSizeProperties = function (childWindow) {
    return {
      width: childWindow.innerWidth || childWindow.document.documentElement.clientWidth,
      height: childWindow.innerHeight || childWindow.document.documentElement.clientHeight,
      offsetWidth: childWindow.document.documentElement.offsetWidth,
      offsetHeight: childWindow.document.documentElement.offsetHeight
    };
  };

  /**
   * Evaluate a command against the active iframe, then use the proxy console
   * to fire information up to the parent
   */
  sandbox.eval = function (cmd) {
    if (!sandbox.active) throw new Error("sandbox.eval: has no active iframe.");

    var re = /(^.|\b)console\.(\S+)/g;

    if (re.test(cmd)) {
      var replaceWith = 'window.runnerWindow.proxyConsole.';
      cmd = cmd.replace(re, function (all, str, arg) {
        return replaceWith + arg;
      });
    }

    var childWindow = sandbox.active.contentWindow;
    var output = null,
        type = 'log';
    try {
      output = childWindow.eval(cmd);
    } catch (e) {
      output = e.message;
      type = 'error';
    }

    return proxyConsole[type](output);
  };

  /**
   * Inject a script via a URL into the page
   */
  sandbox.injectScript = function (url, cb) {
    if (!sandbox.active) throw new Error("sandbox.injectScript: has no active iframe.");
    var childWindow = sandbox.active.contentWindow,
        childDocument = childWindow.document;
    var script = childDocument.createElement('script');
    script.src = url;
    script.onload = function () {
      cb();
    };
    script.onerror = function () {
      cb('Failed to load "' + url + '"');
    };
    childDocument.body.appendChild(script);
  };

  /**
   * Inject full DOM into the page
   */
  sandbox.injectDOM = function (html, cb) {
    if (!sandbox.active) throw new Error("sandbox.injectDOM: has no active iframe.");
    var childWindow = sandbox.active.contentWindow,
        childDocument = childWindow.document;
    try {
      childDocument.body.innerHTML = html;
    } catch (e) {
      cb("Failed to load DOM.");
    }
    cb();
  };

  return sandbox;

}());
