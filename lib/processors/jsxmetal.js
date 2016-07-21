'use strict';

var path = require('path');
var root = path.resolve(path.join(__dirname, '../../'));
var RSVP = require('rsvp');
var metalJSXTransform = require(root + '/public/js/vendor/metalJSXTransform.js');

module.exports = function(data) {
  return new RSVP.Promise(function (resolve) {
    try {
      var res = metalJSXTransform(data.source);
      resolve({
        errors: null,
        result: res
      });
    } catch (e) {
      resolve({
        errors: [e],
        result: null
      });
    }
  });
};