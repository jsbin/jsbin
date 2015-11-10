'use strict';
var uuid = require('uuid');
var debug = require('debug')('jsbin:flash');
var cache = {};

var flash = module.exports = {
  get: function (key) {
    var item = cache[key];
    debug('get: %s - result?', key, !!item);
    flash.clear(key);
    return item ? item.value || null : null;
  },
  set: function (value) {
    var key = uuid.v4();

    debug('set id: %s - value?', key, !!value);

    var timer = setTimeout(function () {
      debug('timeout on %s', key);
      flash.clear(key);
    }, 1000 * 5);

    cache[key] = {
      value: value,
      timer: timer,
    };

    return key;
  },
  clear: function (key) {
    if (!key) {
      Object.keys(cache).forEach(flash.clear);
      cache = {};
    } else {
      debug('clearing %s', key);
      if (cache[key]) {
        clearTimeout(cache[key].timer);
        delete cache[key];
      }
    }
  },
};