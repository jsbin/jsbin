'use strict';

var RSVP = require('rsvp');
var stylus = require('stylus');

module.exports = function (source) {
  return new RSVP.Promise(function (resolve, reject) {
    try {
      stylus(source).render(function (err, result) {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(result.trim());
      });
    } catch (e) {
      reject(e);
    }
  });
};