'use strict';

var path = require('path');
var root = path.resolve(path.join(__dirname, '../../'));
var RSVP = require('rsvp');
var markdown = require(root + '/public/js/vendor/markdown');

module.exports = function (source) {
  return new RSVP.Promise(function (resolve, reject) {
    try {
      resolve(markdown.toHTML(source));
    } catch (e) {
      reject(e);
    }
  });
};