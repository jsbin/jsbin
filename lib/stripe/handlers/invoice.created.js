'use strict';
var stripe = require('stripe');
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
        if (country.toUpperCase() === 'GB') {
          return applyVAT();
        }
        // if they have businessVAT, let's just assume that it's all fine,
        // since we've already validated their VAT, and sometimes
        // this fucking shit happens:
        // Error: The VAT database of the reqeust member country is unavailable, please try again later
        // Also: FUCK VATMOSS and EU and everyone involved in that cluster fuck.
        return;
      } else {
        return applyVAT();
      }

    }).then(function (result) {
      done(null, result);
    }).catch(done);
  };

};
