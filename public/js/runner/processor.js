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

    if (!offset) offset = 0;

    // reset the counters
    processor.counters = {};

    var counter = 'window.runnerWindow.protect';

    lines.forEach(function (line, i) {
      var index = 0,
          lineNum = i - offset;

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

        line = ';' + counter + '({ line: ' + lineNum + ', reset: true });\n' + line;
        processor.counters[lineNum] = {};
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
    if (state.reset) {
      line.count = 0;
    } else {
      line.count++;
      if (line.count > 100000) {
        // we've done a ton of loops, then let's say it smells like an infinite loop
        console.error("Suspicious loop detected at line " + state.line);
        return true;
      }
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

    // Restore the blocking functions
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

if (typeof exports !== 'undefined') {
  module.exports = processor;
}
