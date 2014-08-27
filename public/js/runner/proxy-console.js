/** =========================================================================
 * Console
 * Proxy console.logs out to the parent window
 * ========================================================================== */

var proxyConsole = (function () {
  'use strict';
  /*global stringify, runner*/
  var supportsConsole = true;
  try { window.console.log('d[ o_0 ]b'); } catch (e) { supportsConsole = false; }

  var proxyConsole = function() {};

  /**
   * Stringify all of the console objects from an array for proxying
   */
  var stringifyArgs = function (args) {
    var newArgs = [];
    // TODO this was forEach but when the array is [undefined] it wouldn't
    // iterate over them
    var i = 0, length = args.length, arg;
    for(; i < length; i++) {
      arg = args[i];
      if (typeof arg === 'undefined') {
        newArgs.push('undefined');
      } else {
        newArgs.push(stringify(arg));
      }
    }
    return newArgs;
  };

  // Create each of these methods on the proxy, and postMessage up to JS Bin
  // when one is called.
  var methods = proxyConsole.prototype.methods = [
    'debug', 'clear', 'error', 'info', 'log', 'warn', 'dir', 'props', '_raw',
    'group', 'groupEnd', 'dirxml', 'table', 'trace', 'assert', 'count',
    'markTimeline', 'profile', 'profileEnd', 'time', 'timeEnd', 'timeStamp',
    'groupCollapsed'
  ];

  var pending = null;

  methods.forEach(function (method) {
    // Create console method
    proxyConsole.prototype[method] = function () {
      // Replace args that can't be sent through postMessage
      var originalArgs = [].slice.call(arguments),
          args = stringifyArgs(originalArgs);

      // Post up with method and the arguments
      runner.postMessage('console', {
        method: method === '_raw' ? originalArgs.shift() : method,
        args: method === '_raw' ? args.slice(1) : args
      });

      // If the browser supports it, use the browser console but ignore _raw,
      // as _raw should only go to the proxy console.
      // Ignore clear if it doesn't exist as it's beahviour is different than
      // log and we let it fallback to jsconsole for the panel and to nothing
      // for the browser console
      if (window.console) {
        if (!console[method]) {
          method = 'log';
        }

        if (method === 'log' || method === 'warn' || method === 'error') {
          var args = [].slice.call(arguments);

          // Okay, bear with me, this is complicated.
          // Ref https://github.com/jsbin/jsbin/issues/1888
          //
          // When using console.log, we want the *right* line that the logging
          // happened on to appear in the native console. To achieve this, we
          // need the *actual* log (or warn or error) fuction call to happen
          // on the original line in the user's code.
          //
          // However, since we *also* need to send an update to our own logger,
          // we monkeypatch the console object that the user has access to.
          //
          // The net result, is the user's code is changed from:
          //
          //     console.log('something', object, [1,2,3]);
          //
          // To:
          //
          //     console.log('something', object, [1,2,3])._()();
          //
          // This is *three* (yes, count them) separate function calls now.
          //
          // 1. To our custom console *and* the arguments are cached
          // 2. To this system to flag that our monkeypatched code has run
          // 3. To finally call the native log (with the cached args applied)
          //
          // It's important to note that the first call returns an object that
          // has a single property method `_`. The reason for this is because
          // if the `_` method isn't called immediately, we'll fire the native
          // logging for the user (at the cost of losing the original line).
          //
          // Why? This is because the user may include an external script that
          // we *can't* run our regexp on (to apply the `._()()`).
          //
          // When the user code has a log, warn or error, we cache a function
          // that can call the natve console log with their arguments. This is
          // the `pending` variable.
          //
          // When the `_()` function is called, it clears the `pending`.
          //
          // If a logger is called again whilst there's a `pending` function,
          // it first runs the outstanding pending logger, and only then carries
          // on - this ensure the logs come out in the right order.
          //
          // Finally, as a backup, a `setTimeout(0)` is used in case there's a
          // break in the event loop, which will check for any pending logging
          // and flush if neccessary.


          // this is the native function call to console which is used in the
          // user's code (the 3rd function call)
          var logger = Function.prototype.apply.bind(window.console[method], window.console, args);

          // we return an object, because we can swap out the callback later on
          // if we clear the pending logger
          var result = {
            _: function() {
              pending = null;
              return logger;
            }
          };

          // flush outstanding console logs
          if (pending) {
            pending();
          }

          // this is our backup pending logger, called if we try to log again
          // or via a setTimeout.
          pending = function () {
            console[method].apply(console, originalArgs);
            pending = null;
          };

          setTimeout(function () {
            if (!pending) {
              return;
            }

            // in case this is somehow called again
            result._ = function() {
              return function () {};
            };
            pending = null;
            console[method].apply(console, originalArgs);
          }, 0)

          // finally return this object, and the render.js code will transform
          // user code from console.log('foo') to console.log('foo')._()();
          return result;
        } else if (window.console && method !== '_raw') {
          if (method !== 'clear' || (method === 'clear' && console.clear)) {
            console[method].apply(console, originalArgs);
          }
        }
      }
    };
  });

  return new proxyConsole();

}());