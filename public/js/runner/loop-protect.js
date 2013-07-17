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
        re = /\b(for|while|do)\b/;

    if (!offset) offset = 0;

    var method = 'window.runnerWindow.protect';
    var ignore = {};

    var insertReset = function (lineNum, line) {
      return ';' + method + '({ line: ' + lineNum + ', reset: true });\n' + line;
    };

    lines.forEach(function (line, i) {
      var next = line,
          index = 0,
          lineNum = i - offset + 1, // +1 since we're humans and don't read lines numbers from zero
          character = '',
          cont = true,
          oneliner = false,
          terminator = false,
          match = (line.match(re) || [null,''])[1];

      if (ignore[i]) return;


      if (match && line.indexOf('jsbin') === -1) {
        // make sure this is an actual loop command by searching backwards
        // to ensure it's not a string, comment or object property
        index = line.indexOf(match);

        // first we need to walk backwards to ensure that our match isn't part
        // of a string or part of a comment
        while (--index > -1) {
          character = line.substr(index, 1);
          if (character === '"' || character === "'" || character === '.') {
            // our loop keyword was actually either in a string or a property, so let's exit and ignore this line
            recompiled.push(line);
            return;
          }
          if (character === '/' || character === '*') {
            // looks like a comment, go back one to confirm or not
            --index;
            if (character === '/') {
              // we've found a comment, so let's exit and ignore this line
              recompiled.push(line);
              return;
            }
          }
        }

        // now work our way forward to look for '{'
        index = line.indexOf(match) + match.length;

        while (++index < line.length) {
          character = line.substr(index, 1);
          if (character === ')') {
            terminator = index;
          }

          if (terminator !== false && character === ';') {
            // this is the end of a oneliner
            oneliner = true;

            // insert the loop protection extra new lines ensure we clear any comments on the original line
            line = line.substring(0, terminator + 1) + '{\nif (' + method + '({ line: ' + lineNum + ' })) break;\n' + line.substring(terminator + 1) + '\n}\n';
            recompiled.push(insertReset(lineNum, line));
            return;
          }

          if (character === '{') {
            // we've found the start of the loop, so insert the loop protection
            line = line.substring(0, index + 1) + ';\nif (' + method + '({ line: ' + lineNum + ' })) break;';
            recompiled.push(insertReset(lineNum, line));
            return;
          }
        }

        // if we didn't find the start of the loop program,
        // then move on to the next line to work out whether
        // this is a one liner or if there's a new line to
        // get to the the curly.
        next = lines[i+1];

        // reset the index to the start of the line and work forwards
        index = 0;
        do {
          character = next.substr(index, 1);

          if (character === '{' || character === ';') {

            // we found a curly, so we need to insert: `if (...)\n { dostuff();\n}`
            if (character === '{') {
              // we've found the start of the loop, so insert the loop protection
              next = next.substring(0, index + 1) + ';\nif (' + method + '({ line: ' + lineNum + ' })) break;';
            }

            // this is the end of a mutliline one-liner: `if (...)\n dostuff();`
            if (character === ';') {
              // insert the loop protection extra new lines ensure we clear any comments on the original line
              next = '{\nif (' + method + '({ line: ' + lineNum + ' })) break;\n' + next + '\n}\n';
            }

            recompiled.push(insertReset(lineNum, line));
            recompiled.push(next);
            ignore[i + 1] = true;
            return;
          }

        } while (++index < next.length);


        // just in case...but really we shouldn't get here.
        recompiled.push(line);
      } else {
        // else we're a regular line, and we shouldn't be touched
        recompiled.push(line);
      }
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
      var msg = "Exiting suspicious and potentially infinite loop at line " + state.line;
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
