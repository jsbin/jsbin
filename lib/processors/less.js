'use strict';

var RSVP = require('rsvp');
var less = require('less');

module.exports = function (source) {
  return new RSVP.Promise(function (resolve, reject) {
    try {
      less.Parser().parse(source, function (err, result) {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(result.toCSS().trim());
      });
    } catch (e) {
      reject(e);
    }
  });
};