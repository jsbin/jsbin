'use strict';
var stripe = require('stripe');
var Promise = require('promise');
var validateVAT = require('validate-vat');
var utils = require('../utils');
var debug = require('debug')('jsbin:upgrade');

module.exports = function (stripe) {

  return function (req, data, done) {

    var customerId = data.customer;
    var invoiceId = data.id;

    // if the invoice has been paid don't add VAT
    // e.g. when it is the first invoice.
    if (data.paid) {
      debug('invoice.created - paid');
      return done(null);
    }

    debug('stripe.customers.retrieve(%s)', customerId);
    stripe.customers.retrieve(customerId).then(function (customer) {
      var country = utils.getCountry(customer);
      debug('checking VAT for %s', country);
      if (utils.countryIsInEU(country) === false) {
        return done(null);
      }

      function applyVAT() {
        return utils.getVATByCountry(country).then(function (VAT) {
          return stripe.invoiceItems.create({
            customer: customerId,
            invoice: invoiceId,
            amount: Math.round(parseInt(data.total, 10) * VAT),
            currency: 'gbp',
            description: 'VAT @ ' + (VAT * 100 | 0) + '%',
          });
        });
      }

      var businessVAT = customer.metadata.vat;

      if (businessVAT) {
        return new Promise(function (resolve, reject) {
          validateVAT(country, businessVAT, function (err, result) {
            if (err) {
              return reject(err);
            }

            if (result.valid) {
              resolve();
            } else {
              resolve(applyVAT());
            }
          });
        })
      } else {
        return applyVAT();
      }

    }).then(function (error, result) {
      done(error, result);
    }).catch(done);
  };

};
