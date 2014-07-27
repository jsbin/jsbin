'use strict';

var RSVP = require('rsvp');
var less = require('less');

module.exports = function (data) {
  return new RSVP.Promise(function (resolve) {
    less.render(data.source, function (error, css) {
      if (error) {
        // index starts at 1
        var line = parseInt(error.line, 10) || 0;
        var ch = parseInt(error.column, 10) || 0;
        if (line > 0) {
          line = line - 1;
        }
        if (ch > 0) {
          ch = ch - 1;
        }
        var errors = {
          line: line,
          ch: ch,
          msg: error.message
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
