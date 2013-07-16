/**
 * Protect against infinite loops.
 * Look for for, while and do loops, and insert a check function at the start of
 * the loop. If the check function is called many many times then it returns
 * true, preventing the loop from running again.
 */
var loopProtect = (function () {

  var loopProtect = {};

  // used in the loop detection
  loopProtect.counters = {};

  /**
   * Look for for, while and do loops, and inserts *just* at the start of the
   * loop, a check function.
   */
  loopProtect.rewriteLoops = function (code, offset) {
    var recompiled = [],
        lines = code.split('\n'),
        re = /(for|while|do)\b/;

    if (!offset) offset = 0;

    var method = 'window.runnerWindow.protect';

    lines.forEach(function (line, i) {
      var index = 0,
          lineNum = i - offset,
          character = '',
          cont = true,
          match = (line.match(re) || [,''])[1];

      if (match && line.indexOf('jsbin') === -1) {
        // make sure this is an actual loop command by searching backwards
        // to ensure it's not a string, comment or object property
        index = line.indexOf(match);
        while (--index > -1) {
          character = line.substr(index, 1);
          if (character === '"' || character === "'" || character === '.') {
            cont = false;
            break;
          }
          if (character === '/' || character === '*') {
            // looks like a comment, go back one to confirm or not
            --index;
            if (character === '/') {
              cont = false;
              break;
            }
          }
        }

        // we are good to continue the rewrite
        if (cont === true) {
          // try to insert the tracker after the openning brace (like while (true) { ^here^ )
          index = line.indexOf('{');
          if (index !== -1) {
            line = line.substring(0, index + 1) + ';\nif (' + method + '({ line: ' + lineNum + ' })) break;';
          } else {
            index = line.indexOf(')');
            if (index !== -1) {
              // look for a one liner
              var colonIndex = line.substring(index).indexOf(';');
              if (colonIndex !== -1) {
                // in which case, rewrite the loop to add braces
                colonIndex += index;
                line = line.substring(0, index + 1) + '{\nif (' + method + '({ line: ' + lineNum + ' })) break;\n' + line.substring(index + 1) + '\n}\n'; // extra new lines ensure we clear comment lines
              }
            }
          }

          line = ';' + method + '({ line: ' + lineNum + ', reset: true });\n' + line;
          loopProtect.counters[lineNum] = {};

        }
      }
      recompiled.push(line);
    });

    return recompiled.join('\n');
  };

  /**
   * Injected code in to user's code to **try** to protect against infinite
   * loops cropping up in the code, and killing the browser. Returns true
   * when the loops has been running for more than 100ms.
   */
  loopProtect.protect = function (state) {
    loopProtect.counters[state.line]  = loopProtect.counters[state.line] || {};
    var line = loopProtect.counters[state.line];
    if (state.reset) {
      line.time = +new Date;
    }
    if ((+new Date - line.time) > 100) {
      // We've spent over 100ms on this loop... smells infinite.
      var msg = "Suspicious loop detected at line " + state.line;
      if (window.proxyConsole) {
        window.proxyConsole.error(msg);
      } else console.error(msg);
      // Returning true prevents the loop running again
      return true;
    }
    return false;
  };

  loopProtect.reset = function () {
    // reset the counters
    loopProtect.counters = {};
  };

  return loopProtect;

}());

if (typeof exports !== 'undefined') {
  module.exports = loopProtect;
}
