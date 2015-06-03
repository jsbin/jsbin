'use strict';
var fs = require('fs'),
    path = require('path'),
    existsSync = fs.existsSync || path.existsSync, // yeah folks, have some of that.
    localconfig = '';


// Try to find the config.local.json first in the 2nd CLI argument, then in the
// JSBIN_CONFIG env argument, then in the current working directory, the screw
// it, just assume it's in the same directory as this code

if (!process.env.JSBIN_CONFIG && process.argv[2]) {
  process.env.JSBIN_CONFIG = process.argv[2];
}

// If a custom config is passed in, resolve its path
if (process.env.JSBIN_CONFIG) {
  localconfig = path.resolve(process.cwd(), process.env.JSBIN_CONFIG);
}

if (!fs.existsSync(localconfig)) {
  // try the cwd
  localconfig = path.resolve(path.resolve(process.cwd(), 'config.local.json'));
}

if (!fs.existsSync(localconfig)) {
  localconfig = path.resolve(path.resolve(__dirname, 'config.local.json'));
}

console.log('Config from %s', localconfig);

// Loads the configuration options from the config.*.json files.
//
// By default load the contents of config.default.json, these keys can be
// over-ridden by providing a user config.local.json file with any keys that
// you wish to override.
//
// Environment variables will then overwrite any default or local config settings
// Environment variables must follow the format JSBIN_[KEY_UCASE]_[KEY_UCASE]
//  (note that all keys are upper cased and all non alpha numberic chars are replaced with _)
// for example the following config setting:
//   {
//     'url': {
//       'host': 'localhost:3300'
//     }
//   }
// can be overriden with the following environment variable set
// JSBIN_URL_HOST=my.url.com
//
//
// It is also possible to define your own config file by passing an absolute
// path to the file as the JSBIN_CONFIG environment variable.
//
// Example:
//
//   $ JSBIN_CONFIG=/path/to/config.js jsbin
var config = require('../config.default.json');

function deepExtend(target, object) {
  Object.getOwnPropertyNames(object).forEach(function (key) {
    var value = object[key];

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      target[key] = deepExtend(target[key] || {}, value);
    } else {
      target[key] = value;
    }
  });
  return target;
}

if (existsSync(localconfig)) {
  deepExtend(config, require(localconfig));
}

function importEnvVars(collection, envPrefix) {
  Object.getOwnPropertyNames(collection).forEach(function (key) {
    var value = collection[key],
        envKey = envPrefix + '_' + key.toUpperCase().replace(/[^a-z0-9_]+/gi,'_'),
        envValue = process.env[envKey];
    if ((typeof(value) == 'number') || (typeof(value) == 'string') || (typeof(value) == 'boolean') || (value == null)) {
      if (envValue && typeof(envValue == 'string')) {
        if (envValue.match(/^\s*(true|on)\s*$/i)) {
          envValue = true;
        } else if (envValue.match(/^\s*(false|off)\s*$/i)) {
          envValue = false;
        }
        collection[key] = envValue;
      }
    } else if (value && (typeof(value) == 'object') && (key != 'reserved')) {
      importEnvVars(value, envKey);
    }
  });
}
importEnvVars(config, 'JSBIN');

module.exports = config;
