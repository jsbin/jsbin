'use strict';
var models = require('../../models');
var customer = models.customer;
// var sessionStore = require('../../app').sessionStore;
var getCustomerByStripeId = Promise.denodeify(customer.getCustomerByStripeId).bind(customer);
var setActive = Promise.denodeify(customer.setActive).bind(customer);
var setProAccount = Promise.denodeify(models.user.setProAccount).bind(models.user);

module.exports = function (req, data, callbackToStripe) {
  var sendStripe200 = callbackToStripe.bind(null, null);

  console.log('customer.subscription.delete', data);

  if (!isCanceled(data)) {
    return sendStripe200();
  }

  setActive(data.customer, false).then(function () {
    return getCustomerByStripeId(data.customer);
  }).then(function (results) {
    var user = results[0];
    return setProAccount(user.name, false).then(function () {
      return user; // pass to next thenable
    });
  }).then(function (user) {
    return req.app.sessionStore.set(user.name, false);
  }).then(sendStripe200)
  .catch(function (error) {
    console.error('failed at customer.subscription.delete');
    console.error(error.stack);
    callbackToStripe(error);
  });

};

function isCanceled(obj) {
  return obj.status ? obj.status === 'canceled' : isCanceled(obj.data || obj.object);
}
