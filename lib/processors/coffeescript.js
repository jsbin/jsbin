'use strict';

var path = require('path');
var root = path.resolve(path.join(__dirname, '../../'));
var RSVP = require('rsvp');
var coffee = require(root + '/public/js/vendor/coffee-script').CoffeeScript;

module.exports = function (source) {
  return new RSVP.Promise(function (resolve, reject) {
    try {
      resolve(coffee.compile(source, {
        bare: true
      }));
    } catch (e) {
      console.error(e.message);
      reject(e);
    }
  });
};