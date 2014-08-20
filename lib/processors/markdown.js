'use strict';

var path = require('path');
var root = path.resolve(path.join(__dirname, '../../'));
var RSVP = require('rsvp');
var marked = require(root + '/public/js/vendor/marked.min.js');

module.exports = function (data) {
  return new RSVP.Promise(function (resolve, reject) {
    try {
      var res = marked(data.source);
      resolve({
        errors: null,
        result: res
      });
    } catch (e) {
      var errors = {
        line: null,
        ch: null,
        msg: e
      };
      resolve({
        errors: [errors],
        result: null
      });
    }
  });
};
