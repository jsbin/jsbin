'use strict';

var path = require('path');
var root = path.resolve(path.join(__dirname, '../../'));
var RSVP = require('rsvp');
var jsx = require(root + '/public/js/vendor/JSXTransformer');

module.exports = function(source) {
  return new RSVP.Promise(function (resolve, reject) {
    try {
      resolve(jsx.transform(source).code);
    } catch (e) {
      console.error(e.message);
      reject(e);
    }
  });
};