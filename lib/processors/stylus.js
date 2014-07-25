'use strict';

var RSVP = require('rsvp');
var stylus = require('stylus');

module.exports = function (data) {
  return new RSVP.Promise(function (resolve) {
    stylus.render(data.source, function (error, css) {
      if (error) {
        // index starts at 1
        var lineMatch = error.message.match(/stylus:(\d+)/);
        var line = parseInt(lineMatch[1], 10) || 0;
        var msg = error.message.match(/\n\n(.+)\n$/);
        if (line > 0) {
          line = line - 1;
        }
        var errors = {
          line: line,
          ch: null,
          msg: msg[1]
        };
        resolve({
          errors: [errors],
          result: null
        });
      }
      var res = css;
      resolve({
        errors: null,
        result: res
      });
    });
  });
};