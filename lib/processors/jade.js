'use strict';
var jade = require('jade');
var RSVP = require('rsvp');

module.exports = function (data) {
  return new RSVP.Promise(function (resolve) {
    try {
      var res = jade.compile(data.source)();
      resolve({
        errors: null,
        result: res
      });
    } catch (e) {
      // index starts at 1
      var lineMatch = e.message.match(/Jade:(\d+)/);
      var line = parseInt(lineMatch[1], 10) || 0;
      if (line > 0) {
        line = line - 1;
      }
      var msg = e.message.match(/\n\n(.+)$/);
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
  });
};