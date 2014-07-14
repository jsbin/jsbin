'use strict';
var jade = require('jade');
var RSVP = require('rsvp');

module.exports = function (source) {
  return new RSVP.Promise(function (resolve, reject) {
    try {
      resolve(jade.compile(source, { pretty: true })());
    } catch (e) {
      reject(e);
    }
  });
};