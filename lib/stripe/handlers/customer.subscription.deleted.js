'use strict';
var models = require('../../models');
var customer = models.customer;
var sessionStore = require('../../app').sessionStore;
var Promise = require('promise'); // jshint ignore:line
var setActive = Promise.denodeify(customer.setActive).bind(customer);

module.exports = function (data, callbackToStripe) {
  var sendStripe200 = callbackToStripe.bind(null, null);

  console.log('customer.subscription.delete', data);

  if (!isCanceled(data)) {
    return sendStripe200();
  }

  setActive(data.customer, false)
    .then(removeProStatusFromDB)
    .then(removeProStatusFromSession)
    .then(sendStripe200)
    .catch(function (error) {
      console.error('failed at customer.subscription.delete');
      console.error(error.stack);
      callbackToStripe(error);
    });

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
