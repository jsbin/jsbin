'use strict';

var zmq = require('zmq');
var requestors = [];
var RSVP = require('rsvp');
var config = require('../config');
var undefsafe = require('undefsafe');

if (!undefsafe(config, 'processor.port')) {
  module.exports = require('./fork');
} else {
  module.exports = function (language, source) {
    var data = {
      language: language,
      source: source,
      // TODO include filename
    };

    return new RSVP.Promise(function (resolve, reject) {
      var requester = zmq.socket('req');
      requestors.push(requester);
      requester.on('message', function (raw) {
        var i = requestors.indexOf(requester);
        if (i !== -1) {
          requestors.splice(i, 1);
        }
        requester.close();
        var data = JSON.parse(raw);
        if (data.error) {
          reject(data.error);
        } else {
          resolve(data.result);
        }
      });
      requester.connect(config.processor.port);
      requester.send(JSON.stringify(data));
    });
  };

  process.on('SIGINT', function() {
    requestors.forEach(function (r) {
      r.close();
    });
    process.exit();
  });
}