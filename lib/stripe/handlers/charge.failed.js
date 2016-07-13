'use strict';
var stripe = require('stripe');
var Promise = require('promise');
var utils = require('../utils');
var models = require('../models').customer;
var customer = models.customer;
var getCustomerByStripeId = Promise.denodeify(customer.getCustomerByStripeId).bind(customer);
var notify = require('../../notify');
var debug = require('debug')('jsbin:upgrade');

module.exports = function (stripe) {
  return function (req, data, done) {
    var customerId = data.customer;

    getCustomerByStripeId(customerId).then(function (customer) {
      notify.user(customer.name, {
        type: notify.error,
        message: 'Latest charge has failed, <a href="/account/subscription#invoices">please check your card details</a>'
      });
      done(null);
    }).catch(done);
  };
};