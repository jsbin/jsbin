/*  Flatten.js - v0.1
 *  Copyright 2011, Aron Carroll
 *  Released under the MIT license
 *  More Information: http://github.com/aron/flatten.js
 */
(function (exports, undefined) {
  var _flatten = exports.flatten,
      _expand  = exports.expand,
      isArray;

  /* Checks an object to see if it is an array.
   *
   * object - An Object to test.
   *
   * Returns true if object is an Array.
   */
  isArray = Array.isArray ? Array.isArray : function (object) {
    return Object.prototype.toString.call(object) === '[object Array]';
  };

  /* Iterates over objects and arrays calling a callback on
   * each iteration and passing in the value, key and object.
   *
   * object   - An Object or Array to iterate over.
   * callback - A callback Function to be fired on each iteration.
   * context  - The scope (this) of the callback fucntion.
   *
   * Returns nothing.
   */
  function forEach(object, callback, context) {
    var index, length;
    if (object.length) {
      if (Array.prototype.forEach) {
        Array.prototype.forEach.call(object, callback, context);
      } else {
        for (index = 0, length = object.length; index < length; index += 1) {
          callback.call(context || this, object[index], index, object);
        }
      }
    } else {
      for (index in object) {
        if (object.hasOwnProperty(index)) {
          callback.call(context || this, object[index], index, object);
        }
      }
    }
  }

  /* Prefixes all keys in an object with a prefix and delimiter.
   *
   * object    - An Object with keys to prefix.
   * prefix    - A String to add as a prefix.
   * delimiter - A delimiter to seperate the prefix and key (default: "").
   *
   * Examples
   *
   *   var obj = {a: 1, b: 2, c: 3}
   *   prefixKeys(obj, 'prefix', '.');
   *   // => {'prefix.a': 1, 'prefix.b': 2 ...}
   *
   * Returns new Object with prefixed keys.
   */
  function prefixKeys(object, prefix, delimiter) {
    var prefixed = {};

    forEach(object, function (value, key) {
      key = [prefix, key].join(delimiter || '');
      prefixed[key] = value;
    });

    return prefixed;
  }

  /* Finds all the values at the end of an object tree and returns them
   * in an Array of object literals with a "key" and "value" properties.
   * The key consists of all parent keys delimited by a special
   * character.
   *
   * object     - An Object literal to traverse.
   * deilimiter - A String used to seperate keys (default: '').
   *
   * Examples
   *
   *   var obj = {a: {b: 'leaf 1', c: 'leaf 2'}};
   *   getLeaves(obj);
   *   // => [{key: 'a.b', value: 'leaf 1'}, {key: 'a.c', value: 'leaf 2'}]
   *
   * Returns Array of leaves.
   */
  function getLeaves(object, delimiter) {
    var leaves = [];

    forEach(object, function (value, key) {
      if (value && typeof value === 'object' && !isArray(value)) {
        value = prefixKeys(value, key, delimiter || '.');
        leaves = leaves.concat(getLeaves(value, delimiter));
      } else {
        leaves.push({
          key:   key,
          value: value
        });
      }
    });

    return leaves;
  }

  /* Public: Flattens an object into a single level. All previously nested
   * objects now have keypaths for keys. The delimiter can also be
   * specified as a second parameter.
   *
   * object    - A deeply nested Object to flatten.
   * delimiter - A delimiter to use in the keypaths (default: ".").
   *
   * Examples
   *
   *   var obj = {a: {b: 'leaf 1', c: 'leaf 2'}};
   *   flatten(obj);
   *   // => {'a.b': 'leaf 1', 'ac': 'leaf 2'}
   *
   * Returns flattened Object.
   */
  function flatten(object, delimiter) {
    var flattened = {};

    forEach(getLeaves(object, delimiter), function (leaf) {
      flattened[leaf.key] = leaf.value;
    });

    return flattened;
  }

  /* Public: Restores the previous "flatten" property on the current
   * scope and returns the function. Use this to redefine the
   * function.
   *
   * Examples
   *
   *   _.flattenObject = flatten.noConflict();
   *
   * Returns flatten Function.
   */
  flatten.noConflict = function () {
    exports.flatten = _flatten;
    return flatten;
  };

  /* Public: Rebuilds a flattened object into a deeply nested
   * object. An optional delimiter can be provided.
   *
   * object    - Object to rebuild.
   * delimiter - String to use as a delimiter (default: ".").
   *
   * Examples
   *
   *   var obj = {'a.b': 'leaf 1', 'ac': 'leaf 2'}
   *   expand(obj);
   *   // => {a: {b: 'leaf 1', c: 'leaf 2'}}
   *
   * Returns expanded Object.
   */
  function expand(object, delimiter) {
    var expanded = {};

    delimiter = delimiter || '.';

    forEach(object, function (value, key) {
      var keys    = key.split(delimiter),
          current = expanded;

      while (keys.length) {
        key = keys.shift();

        if (!current.hasOwnProperty(key)) {
          if (keys.length === 0) {
            current[key] = value;
          } else {
            current[key] = {};
          }
        }

        current = current[key];
      }
    });

    return expanded;
  }

  /* Public: Restores the previous "expand" property on the current
   * scope and returns the function. Use this to redefine the
   * function.
   *
   * Examples
   *
   *   _.expandObject = expand.noConflict();
   *
   * Returns expand Function.
   */
  expand.noConflict = function () {
    exports.expand = _expand;
    return expand;
  };

  // Add support for AMD loaders otherwise export as normal.
  if (typeof exports.define === 'function' && exports.define.amd) {
    exports.define('flatten', {flatten: flatten, expand: expand});
  } else {
    exports.flatten = flatten;
    exports.expand  = expand;
  }

})(typeof exports !== 'undefined' ? exports : this);
