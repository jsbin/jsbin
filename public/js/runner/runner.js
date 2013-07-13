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
  proxyconsole.stringifyArgs = function (args) {
    var newArgs = [];
    // TODO this was forEach but when the array is [undefined] it wouldn't
    // iterate over them
    var i = 0, length = args.length, arg;
    for(; i < length; i++) {
      arg = args[i];
      if (typeof arg === 'undefined') {
        newArgs.push('undefined');
      } else {
        newArgs.push(cleanse(stringify(arg)));
      }
    };
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
          args = proxyconsole.stringifyArgs(originalArgs);
      // Post up with method and the arguments
      runner.postMessage('console', {
        method: method,
        args: args
      });
      // If the browner supports it, use the browser console
      if (window.console) {
        if (!console[method]) method = 'log';
        console[method].apply(console, originalArgs);
      }
    };
  });

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
    restore: '<script>try{delete window.print;delete window.alert;delete window.prompt;delete window.confirm;delete window.open;}catch(e){}</script>'
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

  // used in the loop detection
  processor.counters = {};

  /**
   * Look for for, while and do loops, and inserts *just* at the start
   * of the loop, a check function. If the check function is called
   * many many times, then it throws an exception suspecting this might
   * be an infinite loop.
   */
  processor.rewriteLoops = function (code, offset) {
    var recompiled = [],
        lines = code.split('\n'),
        re = /for\b|while\b|do\b/;

    // reset the counters
    processor.counters = {};

    var counter = 'window.runnerWindow.protect';

    lines.forEach(function (line, i) {
      var index = 0, lineNum = i - offset;
      if (re.test(line) && line.indexOf('jsbin') === -1) {
        // try to insert the tracker after the openning brace (like while (true) { ^here^ )
        index = line.indexOf('{');
        if (index !== -1) {
          line = line.substring(0, index + 1) + ';\nif (' + counter + '({ line: ' + lineNum + ' })) break;';
        } else {
          index = line.indexOf(')');
          if (index !== -1) {
            // look for a one liner
            var colonIndex = line.substring(index).indexOf(';');
            if (colonIndex !== -1) {
              // in which case, rewrite the loop to add braces
              colonIndex += index;
              line = line.substring(0, index + 1) + '{\nif (' + counter + '({ line: ' + lineNum + ' })) break;\n' + line.substring(index + 1) + '\n}\n'; // extra new lines ensure we clear comment lines
            }
          }
        }
        processor.counters[lineNum] = { count: 0 };
      }
      recompiled.push(line);
    });

    return recompiled.join('\n');
  };

  /**
   * Injected code in to user's code to **try** to protect against infinite loops
   * cropping up in the code, and killing the browser. This will throw an exception
   * when a loop has hit over X number of times.
   */
  processor.protect = function (state) {
    var line = processor.counters[state.line];
    line.count++;
    if (line.count > 100000) {
      // we've done a ton of loops, then let's say it smells like an infinite loop
      console.error("Suspicious loop detected at line " + state.line);
      return true;
    }
    return false;
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


    // since we're running in real time, let's try hook in some loop protection
    // basically if a loop runs for many, many times, it's probably an infinite loop
    // so we'll throw an exception. This is done by rewriting the for/while/do
    // loops to call our check at the start of each.
    source = processor.rewriteLoops(source, options.scriptOffset);

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
   */
  runner.parent = {};
  runner.parent.origin = '*';

  /**
   * Log error messages, indicating that it's from the runner.
   */
  runner.error = function () {
    var args = ['Runner:'].concat([].slice.call(arguments));
    if (!('console' in window)) return alert(args.join(' '));
    window.console.error.apply(console, args);
  };

  /**
   * Handle all incoming postMessages to the runner
   */
  runner.handleMessage = function (event) {
    if (!event.origin) return;
    var data = event.data;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      return runner.error('Error parsing event data:', e.message);
    }
    if (typeof runner[data.type] !== 'function') {
      return runner.error('No matching event handler:', data.type);
    }
    runner.parent.source = event.source;
    try {
      runner[data.type](data.data);
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
    runner.parent.source.postMessage(JSON.stringify({
      type: type,
      data: data
    }), runner.parent.origin);
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
  // Attach the proxyconsole
  window.proxyconsole = proxyconsole;
  window.protect = processor.protect;
  // Hook into postMessage
  addEvent(window, 'message', runner.handleMessage);

};

}(window, document));