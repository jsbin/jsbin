(function (window, document, undefined) {

/** =========================================================================
 * JS Bin Runner
 * ========================================================================== */

/**
 * Utilities & polyfills
 */

var prependChild = function(elem, child) { elem.insertBefore(child, elem.firstChild); };
var addEvent = function(elem, event, fn) {
  if (elem.addEventListener) {
    elem.addEventListener(event, fn, false);
  } else {
    elem.attachEvent("on" + event, function() {
      // set the this pointer same as addEventListener when fn is called
      return(fn.call(elem, window.event));
    });
  }
};
if (!window.location.origin) window.location.origin = window.location.protocol+"//"+window.location.host;
try {
  console.log('runner');
} catch (e) {

}
var throttle = function (fn, delay) {
  var timer = null;
  var throttled = function () {
    var context = this, args = arguments;
    throttled.cancel();
    throttled.timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  };

  throttled.cancel = function () {
    clearTimeout(throttled.timer);
  };

  return throttled;
};

var cleanse = function (s) {
  return (s||'').replace(/[<&]/g, function (m) { return {'&':'&amp;','<':'&lt;'}[m];});
};

/** =========================================================================
 * Console
 * Proxy console.logs out to the parent window
 * ========================================================================== */

var proxyconsole = (function () {

  var supportsConsole = true;
  try { window.console.log('runner'); } catch (e) { supportsConsole = false; }

  var proxyconsole = {};

  /**
   * Stringify all of the console objects from an array for proxying
   */
  proxyconsole.replaceBadArgs = function (args) {
    var newArgs = [];
    args.forEach(function (arg) {
      newArgs.push(cleanse(stringify(arg)));
    });
    return newArgs;
  };

  // Create each of these methods on the proxy, and postMessage up to JS Bin
  // when one is called.
  var methods = ['debug', 'error', 'info', 'log', 'warn', 'dir', 'props'];
  methods.forEach(function (method) {
    // Create console method
    proxyconsole[method] = function () {
      // Replace args that can't be sent through postMessage
      var originalArgs = [].slice.call(arguments),
          args = proxyconsole.replaceBadArgs(originalArgs);
      // Post up with method and the arguments
      runner.postMessage('console', {
        method: method,
        args: JSON.stringify(args)
      });
      // If the browner supports it, use the browser console
      if (window.console) {
        if (!console[method]) method = 'log';
        console[method].apply(console, originalArgs);
      }
    };
  });

  window.proxyconsole = proxyconsole;

  return proxyconsole;

}());

/** =========================================================================
 * Processor
 * Modify the prepared source ready to be written to an iframe
 * ========================================================================== */

var processor = (function () {

  var processor = {};

  processor.blockingMethods = {
    kill: '<script>try{window.open=function(){};window.print=function(){};window.alert=function(){};window.prompt=function(){};window.confirm=function(){};}catch(e){}</script>',
    restore: '<script>try{delete window.print;delete window.alert;delete window.prompt;delete window.confirm;delete window.open;}catch(e){}</script>',
  };

  /**
   * Grab the doctype from a string.
   *
   * Returns an object with doctype and tail keys.
   */
  processor.getDoctype = (function () {
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

  /**
   * Replace HTML characters with encoded equivatents for debug mode.
   */
  processor.debug = function (source) {
    return '<pre>' + source.replace(/[<>&]/g, function (m) {
      if (m == '<') return '&lt;';
      if (m == '>') return '&gt;';
      if (m == '"') return '&quot;';
    }) + '</pre>';
  };

  /**
   * Render – build the final source code to be written to the iframe. Takes
   * the original source and an options object.
   */
  processor.render = function (source, options) {

    options = options || [];
    source = source || '';


    var combinedSource = [],
        realtime = (options.requested !== true),
        noRealtimeJs = (options.includeJsInRealtime === false);

    // If the render was realtime and we don't want javascript in realtime
    // renders – Auto-run JS is unchecked – then strip out the Javascript
    if (realtime && noRealtimeJs) {
      source = source.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    // Strip autofocus from the markup, preventing the focus switching out of
    // the editable area.
    source = source.replace(/(<.*?\s)(autofocus)/g, '$1');

    // Make sure the doctype is the first thing in the source
    var doctypeObj = processor.getDoctype(source),
        doctype = doctypeObj.doctype;
    source = doctypeObj.tail;
    combinedSource.push(doctype);

    // Kill the blocking functions
    // IE requires that this is done in the script, rather than off the window
    // object outside of the doc.write.
    if (realtime && options.includeJsInRealtime) {
      combinedSource.push(processor.blockingMethods.kill);
    }

    // Push the source, split from the doctype above.
    combinedSource.push(source);

    // Kill the blocking functions
    // IE requires that this is done in the script, rather than off the window
    // object outside of the doc.write.
    if (realtime && options.includeJsInRealtime) {
      combinedSource.push(processor.blockingMethods.restore);
    }

    // In debug mode return an escaped version
    if (options.debug) {
      return processor.debug(combinedSource.join('\n'));
    }

    return combinedSource.join('\n');

  };

  return processor;

}());

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

  /**
   * Create a new sandboxed iframe.
   */
  sandbox.create = function () {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts');
    iframe.setAttribute('frameBorder', '0');
    return iframe;
  };

  /**
   * Add a new iframe to the page and wait until it has loaded to call the
   * requester back. Also wait until the new iframe has loaded before removing
   * the old one.
   */
  sandbox.use = function (iframe, done) {
    if (!sandbox.target) throw new Error("Sandbox has no target element.");
    sandbox.old = sandbox.active;
    var state = sandbox.saveState(sandbox.old);
    sandbox.active = iframe;
    prependChild(sandbox.target, iframe);
    // setTimeout allows the iframe to be rendered before other code runs,
    // allowing us access to the calculated properties like innerWidth.
    setTimeout(done || '', 0);
    // Wait until the new iframe has loaded to remove the old one
    addEvent(iframe, 'load', function () {
      if (sandbox.old) {
        sandbox.restoreState(sandbox.active, state);
        if (sandbox.old.parentNode) {
          sandbox.old.parentNode.removeChild(sandbox.old);
        }
      }
    });
  };

  /**
   * Restore the state of a prvious iframe, like scroll position.
   */
  sandbox.restoreState = function (iframe, state) {
    if (!iframe) return {};
    var win = iframe.contentWindow;
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
    var win = iframe.contentWindow;
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
      width: childWindow.innerWidth,
      height: childWindow.innerHeight,
      offsetWidth: childWindow.document.documentElement.offsetWidth,
      offsetHeight: childWindow.document.documentElement.offsetHeight
    };
  };

  /**
   * Evaluate a command against the active iframe, then use the proxy console
   * to fire information up to the parent
   */
  sandbox.eval = function (cmd) {
    if (!sandbox.active) throw new Error("Sandbox has no active iframe.");
    var childWindow = sandbox.active.contentWindow;
    var output = null,
        type = 'log';
    try {
      output = childWindow.eval(cmd);
    } catch (e) {
      output = e.message;
      type = 'error';
    }
    return proxyconsole[type](output);
  };

  /**
   * Inject a script via a URL into the page
   */
  sandbox.injectScript = function (url, cb) {
    if (!sandbox.active) throw new Error("Sandbox has no active iframe.");
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
    if (!sandbox.active) throw new Error("Sandbox has no active iframe.");
    var childWindow = sandbox.active.contentWindow,
        childDocument = childWindow.document;
        debugger;
    try {
      childDocument.body.innerHTML = html;
    } catch (e) {
      cb("Failed to load DOM.");
    }
    cb();
  };

  return sandbox;

}());

/** ============================================================================
 * JS Bin Runner
 * Accepts incoming postMessage events and updates a live iframe accordingly.
 * ========================================================================== */

var runner = (function () {

  var runner = {};

  /**
   * Store what parent origin *should* be
   * TODO this should allow anything if x-origin protection should be disabled
   */
  runner.parent = {};
  runner.parent.origin = window.location.origin.replace('run.', '');


  /**
   * Log error messages, indicating that it's from the runner.
   */
  runner.error = function () {
    console.error.apply(console, ['Runner:'].concat([].slice.call(arguments)));
  };

  /**
   * Handle all incoming postMessages to the runner
   */
  runner.handleMessage = function (event) {
    if (event.origin !== runner.parent.origin) {
      return runner.error('Message disallowed, incorrect origin:', event.origin);
    }
    if (typeof runner[event.data.type] !== 'function') {
      return runner.error('No matching event handler:', event.data.type);
    }
    runner.parent.source = event.source;
    try {
      runner[event.data.type](event.data.data);
    } catch (e) {
      runner.error(e.message);
    }
  };

  /**
   * Send message to the parent window
   */
  runner.postMessage = function (type, data) {
    if (!runner.parent.source) {
      return runner.error('No postMessage connection to parent window.');
    }
    runner.parent.source.postMessage({
      type: type,
      data: data
    }, runner.parent.origin);
  };

  /**
   * Render a new preview iframe using the posted source
   */
  runner.render = function (data) {
    var iframe = sandbox.create(data.options);
    sandbox.use(iframe, function () {
      var childDoc = iframe.contentDocument || iframe.contentWindow.document;
          childWindow = childDoc.defaultView || childDoc.parentWindow;
      // Give the child a reference to this window
      childWindow.runnerWindow = window;
      // Process the source according to the options passed in
      var source = processor.render(data.source, data.options);
      childDoc.open();
      // Only one childDoc.write. IE crashes if you have lots.
      childDoc.write(source);
      childDoc.close();
      // Setup the new window
      sandbox.wrap(childWindow, data.options);
    });
  };

  /**
   * Run console commands against the iframe's scope
   */
  runner['console:run'] = function (cmd) {
    sandbox.eval(cmd);
  };

  /**
   * Load script into the apge
   */
  runner['console:load:script'] = function (url) {
    sandbox.injectScript(url, function (err) {
      if (err) return runner.postMessage('console:load:script:error', err);
      runner.postMessage('console:load:script:success', url);
    });
  };

  /**
   * Load DOM into the apge
   */
  runner['console:load:dom'] = function (html) {
    sandbox.injectDOM(html, function (err) {
      if (err) return runner.postMessage('console:load:dom:error', err);
      runner.postMessage('console:load:dom:success');
    });
  };

  return runner;

}());

window.onload = function () {

  /**
   * Live rendering, basic mode.
   * Fallback - load the bin into a new iframe, and let it keep itself up
   * to date using event stream.
   */
  if (!window.postMessage) {
    var iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts');
    iframe.setAttribute('frameBorder', '0');
    document.body.appendChild(iframe);
    iframe.src = window.name;
    return;
  }

  /**
   * Live rendering, postMessage style.
   */
  // Set the sandbox target
  sandbox.target = document.getElementById('sandbox-wrapper');
  // Hook into postMessage
  window.onmessage = runner.handleMessage;
};

}(window, document));