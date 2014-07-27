'use strict';

var path = require('path');
var root = path.resolve(path.join(__dirname, '../../'));
var RSVP = require('rsvp');
var coffee = require(root + '/public/js/vendor/coffee-script').CoffeeScript;

module.exports = function (data) {
  return new RSVP.Promise(function (resolve) {
    try {
      var res = coffee.compile(data.source);
      resolve({
        errors: null,
        result: res
      });
    } catch (e) {
      // index starts at 0
      var errors = {
        line: parseInt(e.location.first_line, 10) || 0, // jshint ignore: line
        ch: parseInt(e.location.first_column, 10) || 0, // jshint ignore: line
        msg: e.message
      };
      resolve({
        errors: [errors],
        result: null
      });
    }
  });
};