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

      // If the browner supports it, use the browser console but ignore _raw,
      // as _raw should only go to the proxy console.
      // Ignore clear if it doesn't exist as it's beahviour is different than
      // log and we let it fallback to jsconsole for the panel and to nothing
      // for the browser console
      if (window.console) {
        if (!console[method]) {
          method = 'log';
        }

        if (window.console && method !== '_raw') {
          if (method !== 'clear' || (method === 'clear' && console.clear)) {
            console[method].apply(console, originalArgs);
          }
        }
      }
    };
  });

  return new proxyConsole();

}());