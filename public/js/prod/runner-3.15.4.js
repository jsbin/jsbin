(function (window, document, undefined) {;if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";
    if (this == null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  }
}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if ('function' !== typeof Array.prototype.reduce) {
  Array.prototype.reduce = function(callback/*, opt_initialValue*/){
    'use strict';
    if (null === this || 'undefined' === typeof this) {
      throw new TypeError(
         'Array.prototype.reduce called on null or undefined');
    }
    if ('function' !== typeof callback) {
      throw new TypeError(callback + ' is not a function');
    }
    var index, value, t = Object( this ),
        length = t.length >>> 0,
        isValueSet = false;
    if (1 < arguments.length) {
      value = arguments[1];
      isValueSet = true;
    }
    for (index = 0; length > index; ++index) {
      if (index in t) {
        if (isValueSet) {
          value = callback(value, t[index], index, t);
        }
        else {
          value = t[index];
          isValueSet = true;
        }
      }
    }
    if (!isValueSet) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    return value;
  };
}


// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if ( !Array.prototype.forEach ) {

  Array.prototype.forEach = function( callback, thisArg ) {

    var T, k;

    if ( this == null ) {
      throw new TypeError( " this is null or not defined" );
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ( {}.toString.call(callback) != "[object Function]" ) {
      throw new TypeError( callback + " is not a function" );
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if ( thisArg ) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while( k < len ) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if ( k in O ) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call( T, kValue, k, O );
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

// https://gist.github.com/1035982
''.trim||(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,'')});

if ( !Object.prototype.hasOwnProperty ) {
  Object.prototype.hasOwnProperty = function(prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in this) && (!(prop in proto) || proto[prop] !== this[prop]);
  };
}

Date.now||(Date.now=function(){return+new Date})

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = Date.now();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function () {
  function Empty() {}
  var slice = [].slice;

  if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) { // .length is 1
          // 1. Let Target be the this value.
          var target = this;
          // 2. If IsCallable(Target) is false, throw a TypeError exception.
          if (typeof target != "function") {
              throw new TypeError("Function.prototype.bind called on incompatible " + target);
          }
          // 3. Let A be a new (possibly empty) internal list of all of the
          //   argument values provided after thisArg (arg1, arg2 etc), in order.
          // XXX slicedArgs will stand in for "A" if used
          var args = slice.call(arguments, 1); // for normal call
          // 4. Let F be a new native ECMAScript object.
          // 11. Set the [[Prototype]] internal property of F to the standard
          //   built-in Function prototype object as specified in 15.3.3.1.
          // 12. Set the [[Call]] internal property of F as described in
          //   15.3.4.5.1.
          // 13. Set the [[Construct]] internal property of F as described in
          //   15.3.4.5.2.
          // 14. Set the [[HasInstance]] internal property of F as described in
          //   15.3.4.5.3.
          var bound = function () {

              if (this instanceof bound) {
                  // 15.3.4.5.2 [[Construct]]
                  // When the [[Construct]] internal method of a function object,
                  // F that was created using the bind function is called with a
                  // list of arguments ExtraArgs, the following steps are taken:
                  // 1. Let target be the value of F's [[TargetFunction]]
                  //   internal property.
                  // 2. If target has no [[Construct]] internal method, a
                  //   TypeError exception is thrown.
                  // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Construct]] internal
                  //   method of target providing args as the arguments.

                  var result = target.apply(
                      this,
                      args.concat(slice.call(arguments))
                  );
                  if (Object(result) === result) {
                      return result;
                  }
                  return this;

              } else {
                  // 15.3.4.5.1 [[Call]]
                  // When the [[Call]] internal method of a function object, F,
                  // which was created using the bind function is called with a
                  // this value and a list of arguments ExtraArgs, the following
                  // steps are taken:
                  // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                  //   property.
                  // 2. Let boundThis be the value of F's [[BoundThis]] internal
                  //   property.
                  // 3. Let target be the value of F's [[TargetFunction]] internal
                  //   property.
                  // 4. Let args be a new list containing the same values as the
                  //   list boundArgs in the same order followed by the same
                  //   values as the list ExtraArgs in the same order.
                  // 5. Return the result of calling the [[Call]] internal method
                  //   of target providing boundThis as the this value and
                  //   providing args as the arguments.

                  // equiv: target.call(this, ...boundArgs, ...args)
                  return target.apply(
                      that,
                      args.concat(slice.call(arguments))
                  );

              }

          };
          if(target.prototype) {
              Empty.prototype = target.prototype;
              bound.prototype = new Empty();
              // Clean up dangling references.
              Empty.prototype = null;
          }
          // XXX bound.length is never writable, so don't even try
          //
          // 15. If the [[Class]] internal property of Target is "Function", then
          //     a. Let L be the length property of Target minus the length of A.
          //     b. Set the length own property of F to either 0 or L, whichever is
          //       larger.
          // 16. Else set the length own property of F to 0.
          // 17. Set the attributes of the length own property of F to the values
          //   specified in 15.3.5.1.

          // TODO
          // 18. Set the [[Extensible]] internal property of F to true.

          // TODO
          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
          // 20. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
          //   false.
          // 21. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
          //   and false.

          // TODO
          // NOTE Function objects created using Function.prototype.bind do not
          // have a prototype property or the [[Code]], [[FormalParameters]], and
          // [[Scope]] internal properties.
          // XXX can't delete prototype in pure-js.

          // 22. Return F.
          return bound;
      };
  }
}());

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function () {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      // NOTE: Absolute correctness would demand Object.defineProperty
      //       be used.  But this method is fairly new, and failure is
      //       possible only if Object.prototype or Array.prototype
      //       has a property |i| (very unlikely), so use a less-correct
      //       but more portable alternative.
      if (i in t)
        res[i] = fun.call(thisArg, t[i], i, t);
    }

    return res;
  };
};/**
 * Stringify.
 * Inspect native browser objects and functions.
 */
var stringify = (function () {

  var sortci = function(a, b) {
    return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
  };

  var htmlEntities = function (str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  /**
   * Recursively stringify an object. Keeps track of which objects it has
   * visited to avoid hitting circular references, and a buffer for indentation.
   * Goes 2 levels deep.
   */
  return function stringify(o, visited, buffer) {
    var i, vi, type = '', parts = [], circular = false;
    buffer = buffer || '';
    visited = visited || [];

    // Get out fast with primitives that don't like toString
    if (o === null) {
      return 'null';
    }
    if (typeof o === 'undefined') {
      return 'undefined';
    }

    // Determine the type
    try {
      type = ({}).toString.call(o);
    } catch (e) { // only happens when typeof is protected (...randomly)
      type = '[object Object]';
    }

    // Handle the primitive types
    if (type == '[object Number]') {
      return ''+o;
    }
    if (type == '[object Boolean]') {
      return o ? 'true' : 'false';
    }
    if (type == '[object Function]') {
      return o.toString().split('\n  ').join('\n' + buffer);
    }
    if (type == '[object String]') {
      return '"' + htmlEntities(o.replace(/"/g, '\\"')) + '"';
    }

    // Check for circular references
    for (vi = 0; vi < visited.length; vi++) {
      if (o === visited[vi]) {
        // Notify the user that a circular object was found and, if available,
        // show the object's outerHTML (for body and elements)
        return '[circular ' + type.slice(1) +
          ('outerHTML' in o ? ' :\n' + htmlEntities(o.outerHTML).split('\n').join('\n' + buffer) : '')
      }
    }

    // Remember that we visited this object
    visited.push(o);

    // Stringify each member of the array
    if (type == '[object Array]') {
      for (i = 0; i < o.length; i++) {
        parts.push(stringify(o[i], visited));
      }
      return '[' + parts.join(', ') + ']';
    }

    // Fake array – very tricksy, get out quickly
    if (type.match(/Array/)) {
      return type;
    }

    var typeStr = type + ' ',
        newBuffer = buffer + '  ';

    // Dive down if we're less than 2 levels deep
    if (buffer.length / 2 < 2) {

      var names = [];
      // Some objects don't like 'in', so just skip them
      try {
        for (i in o) {
          names.push(i);
        }
      } catch (e) {}

      names.sort(sortci);
      for (i = 0; i < names.length; i++) {
        try {
          parts.push(newBuffer + names[i] + ': ' + stringify(o[names[i]], visited, newBuffer));
        } catch (e) {}
      }

    }

    // If nothing was gathered, return empty object
    if (!parts.length) return typeStr + '{ ... }';

    // Return the indented object with new lines
    return typeStr + '{\n' + parts.join(',\n') + '\n' + buffer + '}';
  };
}());;/**
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

var getIframeWindow = function (iframeElement) {
    return iframeElement.contentWindow || iframeElement.contentDocument.parentWindow;
};;/**
 * Protect against infinite loops.
 * Look for for, while and do loops, and insert a check function at the start of
 * the loop. If the check function is called many many times then it returns
 * true, preventing the loop from running again.
 */
var loopProtect = (function () {
  'use strict';
  var debug = null;

  // the standard loops - note that recursive is not supported
  var re = /\b(for|while|do)\b/g;
  var reSingle = /\b(for|while|do)\b/;
  var labelRe = /\b([a-z_]{1}\w+:)/i;
  var comments = /(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm;

  var loopProtect = {};

  // used in the loop detection
  loopProtect.counters = {};

  // expose debug info
  loopProtect.debug = function (state) {
    debug = state ? function () {
      console.log.apply(console, [].slice.apply(arguments));
    } : function () {};
  };

  loopProtect.debug(false); // off by default

  // the method - as this could be aliased to something else
  loopProtect.method = 'window.runnerWindow.protect';

  function inMultilineComment(lineNum, lines) {
    if (lineNum === 0) {
      return false;
    }

    var j = lineNum;
    var closeCommentTags = 1; // let's assume we're inside a comment
    var closePos = -1;
    var openPos = -1;

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
          return true;
        }
      }
    } while (j !== 0);

    return false;
  }

  function inCommentOrString(index, line) {
    var character;
    while (--index > -1) {
      character = line.substr(index, 1);
      if (character === '"' || character === '\'' || character === '.') {
        // our loop keyword was actually either in a string or a property, so let's exit and ignore this line
        debug('- exit: matched inside a string or property key');
        return true;
      }
      if (character === '/' || character === '*') {
        // looks like a comment, go back one to confirm or not
        --index;
        if (character === '/') {
          // we've found a comment, so let's exit and ignore this line
          debug('- exit: part of a comment');
          return true;
        }
      }
    }
    return false;
  }

  function directlyBeforeLoop(index, lineNum, lines) {
    reSingle.lastIndex = 0;
    labelRe.lastIndex = 0;
    var beforeLoop = false;

    var theRest = lines.slice(lineNum).join('\n').substr(index).replace(labelRe, '');
    theRest.replace(reSingle, function (match, capture, i) {
      var target = theRest.substr(0, i).replace(comments, '').trim();
      debug('- directlyBeforeLoop: ' + target);
      if (target.length === 0) {
        beforeLoop = true;
      }
      // strip comments out of the target, and if there's nothing else
      // it's a valid label...I hope!
    });

    return beforeLoop;
  }

  /**
   * Look for for, while and do loops, and inserts *just* at the start of the
   * loop, a check function.
   */
  loopProtect.rewriteLoops = function (code, offset) {
    var recompiled = [];
    var lines = code.split('\n');
    var disableLoopProtection = false;
    var method = loopProtect.method;
    var ignore = {};
    var pushonly = {};
    var labelPostion = null;

    var insertReset = function (lineNum, line, matchPosition) {
      // recompile the line with the reset **just** before the actual loop
      // so that we insert in to the correct location (instead of possibly
      // outside the logic
      return line.slice(0, matchPosition) + ';' + method + '({ line: ' + lineNum + ', reset: true }); ' + line.slice(matchPosition);
    };

    if (!offset) {
      offset = 0;
    }

    lines.forEach(function (line, lineNum) {
      // reset our regexp each time.
      re.lastIndex = 0;
      labelRe.lastIndex = 0;

      if (disableLoopProtection) {
        return;
      }

      if (line.toLowerCase().indexOf('noprotect') !== -1) {
        disableLoopProtection = true;
      }

      var index = -1;
      var matchPosition = -1;
      var originalLineNum = lineNum;
      // +1 since we're humans and don't read lines numbers from zero
      var printLineNumber = lineNum - offset + 1;
      var character = '';
      // special case for `do` loops, as they're end with `while`
      var dofound = false;
      var findwhile = false;
      var terminator = false;
      var matches = line.match(re) || [];
      var match = matches.length ? matches[0] : '';
      var labelMatch = line.match(labelRe) || [];
      var openBrackets = 0;
      var openBraces = 0;

      if (labelMatch.length) {
        debug('- label match');
        index = line.indexOf(labelMatch[1]);
        if (!inCommentOrString(index, line)) {
          if (!inMultilineComment(lineNum, lines)) {
            if (directlyBeforeLoop(index, lineNum, lines)) {
              debug('- found a label: "' + labelMatch[0] + '"');
              labelPostion = lineNum;
            } else {
              debug('- ignored "label", false positive');
            }
          } else {
            debug('- ignored label in multline comment');
          }
        } else {
          debug('- ignored label in string or comment');
        }
      }

      if (ignore[lineNum]) {
        debug(' -exit: ignoring line ' + lineNum +': ' + line);
        return;
      }

      if (pushonly[lineNum]) {
        debug('- exit: ignoring, but adding line ' + lineNum + ': ' + line);
        recompiled.push(line);
        return;
      }

      // if there's more than one match, we just ignore this kind of loop
      // otherwise I'm going to be writing a full JavaScript lexer...and god
      // knows I've got better things to be doing.
      if (match && matches.length === 1 && line.indexOf('jsbin') === -1) {
        debug('match on ' + match + '\n');

        // there's a special case for protecting `do` loops, we need to first
        // prtect the `do`, but then ignore the closing `while` statement, so
        // we reset the search state for this special case.
        dofound = match === 'do';

        // make sure this is an actual loop command by searching backwards
        // to ensure it's not a string, comment or object property
        matchPosition = index = line.indexOf(match);

        // first we need to walk backwards to ensure that our match isn't part
        // of a string or part of a comment
        if (inCommentOrString(index, line)) {
          recompiled.push(line);
          return;
        }

        // it's quite possible we're in the middle of a multiline
        // comment, so we'll cycle up looking for an opening comment,
        // and if there's one (and not a closing `*/`), then we'll
        // ignore this line as a comment
        if (inMultilineComment(lineNum, lines)) {
          recompiled.push(line);
          return;
        }

        // now work our way forward to look for '{'
        index = line.indexOf(match) + match.length;

        if (index === line.length) {
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

        while (index < line.length) {
          character = line.substr(index, 1);
          // debug(character, index);

          if (character === '(') {
            openBrackets++;
          }

          if (character === ')') {
            openBrackets--;

            if (openBrackets === 0 && terminator === false) {
              terminator = index;
            }
          }

          if (character === '{') {
            openBraces++;
          }

          if (character === '}') {
            openBraces--;
          }

          if (openBrackets === 0 && (character === ';' || character === '{')) {
            // if we're a non-curlies loop, then convert to curlies to get our code inserted
            if (character === ';') {
              if (lineNum !== originalLineNum) {
                debug('- multiline inline loop');
                // affect the compiled line
                recompiled[originalLineNum] = recompiled[originalLineNum].substring(0, terminator + 1) + '{\nif (' + method + '({ line: ' + printLineNumber + ' })) break;\n' + recompiled[originalLineNum].substring(terminator + 1);
                line += '\n}\n';
              } else {
                // simpler
                debug('- single line inline loop');
                line = line.substring(0, terminator + 1) + '{\nif (' + method + '({ line: ' + printLineNumber + ' })) break;\n' + line.substring(terminator + 1) + '\n}\n';
              }

            } else if (character === '{') {
              debug('- multiline with braces');
              var insert = ';\nif (' + method + '({ line: ' + printLineNumber + ' })) break;\n';
              line = line.substring(0, index + 1) + insert + line.substring(index + 1);

              index += insert.length;
            }

            // work out where to put the reset
            if (lineNum === originalLineNum && labelPostion === null) {
              debug('- simple reset insert');
              line = insertReset(printLineNumber, line, matchPosition);
              index += (';' + method + '({ line: ' + lineNum + ', reset: true }); ').length;
            } else {
              // insert the reset above the originalLineNum OR if this loop used
              // a label, we have to insert the reset *above* the label
              if (labelPostion === null) {
                debug('- reset inserted above original line');
                recompiled[originalLineNum] = insertReset(printLineNumber, recompiled[originalLineNum], matchPosition);
              } else {
                debug('- reset inserted above matched label on line ' + labelPostion);
                if (recompiled[labelPostion] === undefined) {
                  labelPostion--;
                  matchPosition = 0;
                }
                recompiled[labelPostion] = insertReset(printLineNumber, recompiled[labelPostion], matchPosition);
                labelPostion = null;
              }
            }

            recompiled.push(line);

            if (!dofound) {
              return;
            } else {
              debug('searching for closing `while` statement for: ' + line);
              // cycle forward until we find the close brace, after which should
              // be our while statement to ignore
              findwhile = false;
              while (index < line.length) {
                character = line.substr(index, 1);

                if (character === '{') {
                  openBraces++;
                }

                if (character === '}') {
                  openBraces--;
                }

                // debug(character, openBraces);

                if (openBraces === 0) {
                  findwhile = true;
                } else {
                  findwhile = false;
                }

                if (openBraces === 0) {
                  debug('outside of closure, looking for `while` statement: ' + line);
                }

                if (findwhile && line.indexOf('while') !== -1) {
                  debug('- exit as we found `while`: ' + line);
                  pushonly[lineNum] = true;
                  return;
                }

                index++;

                if (index === line.length && lineNum < (lines.length-1)) {
                  lineNum++;
                  line = lines[lineNum];
                  debug(line);
                  index = 0;
                }
              }
              return;
            }
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
        debug('regular line ' + line);
        recompiled.push(line);
      }
    });

    debug('---- source ----');
    debug(code);
    debug('---- rewrite ---');
    debug(recompiled.join('\n'));
    debug('');

    return disableLoopProtection ? code : recompiled.join('\n');
  };

  /**
   * Injected code in to user's code to **try** to protect against infinite
   * loops cropping up in the code, and killing the browser. Returns true
   * when the loops has been running for more than 100ms.
   */
  loopProtect.protect = function (state) {
    loopProtect.counters[state.line] = loopProtect.counters[state.line] || {};
    var line = loopProtect.counters[state.line];
    var now = (new Date()).getTime();

    if (state.reset) {
      line.time = now;
      line.hit = 0;
      line.last = 0;
    }

    line.hit++;
    if ((now - line.time) > 100) {//} && line.hit !== line.last+1) {
      // We've spent over 100ms on this loop... smells infinite.
      var msg = 'Exiting potential infinite loop at line ' + state.line + '. To disable loop protection: add "// noprotect" to your code';
      if (window.proxyConsole) {
        window.proxyConsole.error(msg);
      } else {
        console.error(msg);
      }
      // Returning true prevents the loop running again
      return true;
    }
    line.last++;
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
;/** =========================================================================
 * Console
 * Proxy console.logs out to the parent window
 * ========================================================================== */

var proxyConsole = (function () {
  'use strict';
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
      if (window.console && method !== '_raw') {
        if (!console[method]) { method = 'log'; }
        console[method].apply(console, originalArgs);
      }
    };
  });

  return new proxyConsole();

}());;/** =========================================================================
 * Processor
 * Modify the prepared source ready to be written to an iframe
 * ========================================================================== */

var processor = (function () {

  var processor = {};

  processor.blockingMethods = {
    kill: '<script>try{window.open=function(){};window.print=function(){};window.alert=function(){};window.prompt=function(){};window.confirm=function(){};}catch(e){}</script>',
    // RS: the empty comment in the end of the harness, ensures any
    // open comments are closed, and will ensure the harness is hidden
    // from the user.
    restore: '<!--jsbin live harness--><script>try{delete window.print;delete window.alert;delete window.prompt;delete window.confirm;delete window.open;}catch(e){}</script>'
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
      if (m == '&') return '&amp;';
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
;/** ============================================================================
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
    iframe.setAttribute('sandbox', 'allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts');
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
    if (!sandbox.target) throw new Error("Sandbox has no target element.");
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
;/** ============================================================================
 * JS Bin Runner
 * Accepts incoming postMessage events and updates a live iframe accordingly.
 * ========================================================================== */

var runner = (function () {
  'use strict';
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
    if (!('console' in window)) {return alert(args.join(' '));}
    window.console.error.apply(console, args);
  };

  /**
   * Handle all incoming postMessages to the runner
   */
  runner.handleMessage = function (event) {
    if (!event.origin) {return;}
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
      var childDoc = iframe.contentDocument,
          childWindow = getIframeWindow(iframe);
      if (!childDoc) childDoc = childWindow.document;

      // Reset the console to the prototype state
      proxyConsole.methods.forEach(function (method) {
        delete proxyConsole[method];
      });


      // Process the source according to the options passed in
      var source = processor.render(data.source, data.options);

      // Start writing the page. This will clear any existing document.
      childDoc.open();

      // We need to write a blank line first – Firefox blows away things you add
      // to the child window when you do the fist document.write.
      // Note that each document.write fires a DOMContentLoaded in Firefox.
      // This method exhibits synchronous and asynchronous behaviour, depending
      // on the browser. Urg.
      childDoc.write('');

      // Give the child a reference to things it needs. This has to go here so
      // that the user's code (that runs as a result of the following
      // childDoc.write) can access the objects.
      childWindow.runnerWindow = {
        proxyConsole: proxyConsole,
        protect: loopProtect.protect
      };

      // Reset the loop protection before rendering
      loopProtect.reset();

      // if there's a parse error this will fire
      childWindow.onerror = function (msg, url, line, col, error) {
        // show an error on the jsbin console, but not the browser console
        // (i.e. use _raw), because the browser will throw the native error
        // which (hopefully) includes a link to the JavaScript VM at that time.
        proxyConsole._raw('error', error && error.stack ? error.stack : msg + ' (line ' + line + ')');
      };

      // Write the source out. IE crashes if you have lots of these, so that's
      // why the source is rendered above (processor.render) – it should be one
      // string. IE's a sensitive soul.
      childDoc.write(source);

      // Close the document. This will fire another DOMContentLoaded.
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

}());;/** =========================================================================
 * JS Bin Runner
 * ========================================================================== */

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
  addEvent(window, 'message', runner.handleMessage);

};;})(window, document);