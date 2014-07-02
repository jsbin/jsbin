'use strict';

var axon = require('axon');
var requester = axon.socket('req');
var RSVP = require('rsvp');
var config = require('../config');
var undefsafe = require('undefsafe');

if (!undefsafe(config, 'processor.address')) {
  throw new Error('no processor address');
} else {
  // after 5 seconds give up, and switch to forking
  var timer = setTimeout(function () {

  }, 5000);
  var connected = false;
  requester.connect(config.processor.address);
  requester.on('connect', function () {
    connected = true;
    console.log('processor connection established');
  // not sure when the close event is called
  }).on('close', function () {
    connected = false;
    console.log('processor connection stopped');
  });
  module.exports = function (language, data) {
    data.language = language;
    if (connected) {
      return new RSVP.Promise(function (resolve, reject) {
        requester.send(data, function (data) {
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data.result);
          }
        });
      });
    } else {
      return new RSVP.reject('Processor server unreachable');
    }
  };
}