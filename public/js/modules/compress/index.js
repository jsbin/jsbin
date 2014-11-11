'use strict';
var LZString = require('lz-string');
var _ = require('underscore');

exports.keys = function (keys, obj) {
  var copy = _.clone(obj);
  copy.compressed = keys;
  keys.split(',').forEach(function (key) {
    copy[key] = LZString.compressToUTF16(obj[key]);
  });
  return copy;
};
