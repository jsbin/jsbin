// Loads the configuration options from the config.*.json files.
//
// By default load the contents of config.default.json, these keys can be
// over-ridden by providing a user config.local.json file with any keys that
// you wish to override.
//
// It is also possible to define your own config file by passing an absolute
// path to the file as the JSBIN_CONFIG environment variable.
//
// Example:
//
//   $ JSBIN_CONFIG=/path/to/config.js jsbin
module.exports = require('../config.default.json');

function extend2(target, object) {
  Object.getOwnPropertyNames(object).forEach(function (key) {
    var value = object[key];

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      extend(target[key], value);
    } else {
      target[key] = value;
    }
  });
  return target;
}

function extend() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object") { //} && !jQuery.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( typeof copy === 'object' || (copyIsArray = Array.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];

          } else {
            clone = src && typeof src === 'object' ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

try {
  var local = require(process.env.JSBIN_CONFIG || '../config.local.json');
  extend(true, module.exports, local);
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') {
    throw error;
  }
}
