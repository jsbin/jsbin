var fs = require('fs'),
    path = require('path'),
    existsSync = fs.existsSync || path.existsSync, // yeah folks, have some of that.
    localconfig = process.env.JSBIN_CONFIG || path.resolve(__dirname, '..', 'config.local.json');


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

function deepExtend(target, object) {
  Object.getOwnPropertyNames(object).forEach(function (key) {
    var value = object[key];

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      target[key] = deepExtend(target[key] || {}, value);
    } else {
      target[key] = value;
    }
  });
  return target;
}

if (existsSync(localconfig)) {
  deepExtend(module.exports, require(localconfig));
}