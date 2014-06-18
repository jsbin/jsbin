'use strict';

var axon = require('axon');
var requester = axon.socket('req');
var RSVP = require('rsvp');
var config = require('../config');
var undefsafe = require('undefsafe');

if (!undefsafe(config, 'processor.port')) {
  throw new Error('no processor port');
} else {
  // after 5 seconds give up, and switch to forking
  var timer = setTimeout(function () {

  }, 5000);
  requester.connect(config.processor.port);
  requester.on('connect', function () {
    console.log('processor connection established');
  });
  module.exports = function (language, data) {
    data.language = language;

    return new RSVP.Promise(function (resolve, reject) {
      requester.send(data, function (data) {
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      });
    });
  };
}