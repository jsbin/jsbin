'use strict';

var axon = require('axon');
var requester = axon.socket('req');
var RSVP = require('rsvp');
var config = require('../config');
var undefsafe = require('undefsafe');

if (!undefsafe(config, 'processor.address')) {
  throw new Error('no processor address');
} else {
  var connected = false;
  requester.bind(config.processor.address);
  requester.on('bind', function () {
    connected = true;
    console.log('processor pushing locally, expecting pennyworth to pull');
    // not sure when the close event is called
  }).on('close', function () {
    connected = false;
    console.log('processor connection stopped');
  });
  module.exports = function (language, data) {
    data.language = language;
    if (connected) {
      return new RSVP.Promise(function (resolve, reject) {
        requester.send(data, function (response) {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response.output);
          }
        });
      });
    } else {
      return new RSVP.reject('Processor server unreachable');
    }
  };
}