/** =========================================================================
 * Console
 * Proxy console.logs out to the parent window
 * ========================================================================== */

var proxyConsole = (function () {

  var supportsConsole = true;
  try { window.console.log('runner'); } catch (e) { supportsConsole = false; }

  var proxyConsole = {};

  /**
   * Stringify all of the console objects from an array for proxying
   */
  proxyConsole.stringifyArgs = function (args) {
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
    proxyConsole[method] = function () {
      // Replace args that can't be sent through postMessage
      var originalArgs = [].slice.call(arguments),
          args = proxyConsole.stringifyArgs(originalArgs);
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

  return proxyConsole;

}());