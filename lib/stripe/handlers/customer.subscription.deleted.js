'use strict';
var models = require('../../models');
var sessionStore = require('../../app').sessionStore;
var Promise = require('rsvp').Promise; // jshint ignore:line

module.exports = function (data, callbackToStripe) {
  var sendStripe200 = callbackToStripe.bind(null, null);

  if (!isCanceled(data)) {
    return sendStripe200();
  }

  models.customer.setActive(data.customer, false)
    .then(removeProStatusFromDB)
    .then(removeProStatusFromSession)
    .then(sendStripe200)
    .catch(callbackToStripe);

};

function isCanceled(obj) {
  return obj.status ? obj.status === 'canceled' : isCanceled(obj.data || obj.object);
}

function removeProStatusFromDB(customer) {
  return new Promise(function(resolve, reject) {
    models.user.setProAccount(customer.user, false, function(err) {
      if (err) {
        return reject(err);
      }
      resolve(customer);
    });
  });
}

function removeProStatusFromSession(customer) {
  return sessionStore.set(customer.name, false);
}
