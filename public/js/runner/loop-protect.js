/**
 * Protect against infinite loops.
 * Look for for, while and do loops, and insert a check function at the start of
 * the loop. If the check function is called many many times then it returns
 * true, preventing the loop from running again.
 */
var loopProtect = (function () {

  var debug = false ? function () {
    console.log.apply(console, [].slice.apply(arguments));
  } : function () {};

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

    lines.forEach(function (line, lineNum) {
      var next = line,
          index = 0,
          originalLineNum = lineNum,
          printLineNumber = lineNum - offset + 1, // +1 since we're humans and don't read lines numbers from zero
          character = '',
          cont = true,
          oneliner = false,
          terminator = false,
          match = (line.match(re) || [null,''])[1],
          openBrackets = 0;

      if (ignore[lineNum]) return;

      if (match && line.indexOf('jsbin') === -1) {
        debug('\n');

        // make sure this is an actual loop command by searching backwards
        // to ensure it's not a string, comment or object property
        index = line.indexOf(match);

        // first we need to walk backwards to ensure that our match isn't part
        // of a string or part of a comment
        while (--index > -1) {
          character = line.substr(index, 1);
          if (character === '"' || character === "'" || character === '.') {
            // our loop keyword was actually either in a string or a property, so let's exit and ignore this line
            debug('- exit: matched inside a string or property key');
            recompiled.push(line);
            return;
          }
          if (character === '/' || character === '*') {
            // looks like a comment, go back one to confirm or not
            --index;
            if (character === '/') {
              // we've found a comment, so let's exit and ignore this line
              debug('- exit: part of a comment');
              recompiled.push(line);
              return;
            }
          }
        }

        // it's quite possible we're in the middle of a multiline
        // comment, so we'll cycle up looking for an opening comment,
        // and if there's one (and not a closing `*/`), then we'll
        // ignore this line as a comment
        if (lineNum > 0) {
          var j = lineNum,
              closeCommentTags = 1, // let's assume we're inside a comment
              closePos = -1,
              openPos = -1;
          do {
            j -= 1;
            debug('looking backwards ' + lines[j]);
            closePos = lines[j].indexOf('*/');
            openPos = lines[j].indexOf('/*');

            if (closePos !== -1) {
              closeCommentTags++;
            }

            if (openPos !== -1) {
              closeCommentTags--;

              if (closeCommentTags === 0) {
                debug('- exit: part of a multiline comment');
                recompiled.push(line);
                return;
              }
            }
          } while (j !== 0);
        }

        // now work our way forward to look for '{'
        index = line.indexOf(match) + match.length;

        while (index < line.length) {
          character = line.substr(index, 1);
          debug(character, index);

          if (character === '(') {
            openBrackets++;
          }

          if (character === ')') {
            openBrackets--;

            if (openBrackets === 0 && terminator === false) {
              terminator = index;
            }
          }

          if (openBrackets === 0 && (character === ';' || character === '{')) {
            // if we're a non-curlies loop, then convert to curlies to get our code inserted
            if (character === ';') {
              if (lineNum !== originalLineNum) {
                debug('- multiline inline loop');
                // affect the compiled line
                recompiled[originalLineNum] = recompiled[originalLineNum].substring(0, terminator + 1) + '{\nif (' + method + '({ line: ' + printLineNumber + ' })) break;\n';
                line += '\n}\n';
              } else {
                // simpler
                debug('- single line inline loop');
                line = line.substring(0, terminator + 1) + '{\nif (' + method + '({ line: ' + printLineNumber + ' })) break;\n' + line.substring(terminator + 1) + '\n}\n';
              }

            } else if (character === '{') {
              debug('- multiline with braces');
              line = line.substring(0, index + 1) + ';\nif (' + method + '({ line: ' + printLineNumber + ' })) break;\n' + line.substring(index + 1);
            }

            // work out where to put the reset
            if (lineNum === originalLineNum) {
              debug('- simple reset insert');
              line = insertReset(printLineNumber, line);
            } else {
              // insert the reset above the originalLineNum
              debug('- reset inserted above original line');
              recompiled[originalLineNum] = insertReset(printLineNumber, recompiled[originalLineNum]);
            }

            recompiled.push(line);
            return;
          }

          index++;

          if (index === line.length && lineNum < (lines.length-1)) {
            // move to the next line
            debug('- moving to next line');
            recompiled.push(line);
            lineNum++;
            line = lines[lineNum];
            ignore[lineNum] = true;
            index = 0;
          }
        }
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
