'use strict';
var models = require('../../models');
var sessionStore = require('../../app').sessionStore;
var Promise = require('rsvp').Promise;

module.exports = function (data, callbackToStripe) {
  if (isCanceled(data)) {
  
    var removeProStatus = function(customer){
      sessionStore.destroyByName(customer.user);
      return models.user.setProAccount(customer.user, false);
    };

    var sendStripe200 = callbackToStripe.bind(null, null);

    models.customer.setActive(data.customer, false)
      .then(removeProStatus)
      //.then(removeTeamStatus)
      .then(sendStripe200)
      .catch(callbackToStripe);

  } else {
    callbackToStripe(null);
  }   
};

function isCanceled(obj) {
  return obj.status ? obj.status === 'canceled' : isCanceled(obj.data || obj.object);
}
function removeProStatusFromDB (customer) {
  return new Promise(function(reject, resolve) {
    models.user.setProAccount(customer.user, false, function(err) {
      if (err) {
        return reject(err);
      }
      resolve(customer);
    });
  });
}

function removeProStatusFromSession (customer) {
  return sessionStore.set(customer.name, false);
}
