'use strict';
var stripe = require('stripe');
var Promise = require('promise');
var validateVAT = require('validate-vat');
var models = require('../../models');

function getVATByCountry(countrycode) {
  return Promise.resolve(0.2);
};

function countryIsInEU(countrycode) {
    var EU = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES', 'FI', 'FR', 'GB', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
    return EU.indexOf(countrycode.toUpperCase()) !== -1;
}

function getCountry(customer) {
  var card = customer.default_card; // jshint ignore:line

  var country = customer.cards.data.reduce(function (last, current) {
    if (current.id === card) {
      return current.country;
    } else {
      return last;
    }
  }, null);

  if (country === null) {
    if (customer.cards.data.length === 1) {
      return customer.cards.data[0].country;
    } else {
      // TODO multipile cards and no default ??
      return customer.cards.data[0].country;
    }
  } else {
    return country;
  }

}

module.exports = function (stripe) {

  return function (req, event, done) {

    var data = event.data.object;
    var customer_id = data.customer;
    var invoice_id = data.id;

    stripe.customers.retrieve(customer_id, function (err, customer) {
      var country = getCountry(customer);
      if (countryIsInEU(country) === false) {
        return done(null);
      }

      function applyVAT() {
        getVATByCountry(country).then(function (VAT) {
          stripe.invoiceItems.create({
            customer: customer_id,
            invoice: invoice_id,
            amount: data.total * VAT,
            currency: 'gbp',
            description: 'VAT',
          }, function (err, invoiceItem) {
            if (err) {
              return done(err);
            }
            done(null);
          });
        });
      }

      var VATIN = customer.metadata.vat;

      if (VATIN) {
        validateVAT(country, VATIN, function (err, result) {
          if (err) {
            return done(err);
          }
          if (result.valid) {
            return done(null);
          } else {
            applyVAT();
          }
        });
      } else {
        applyVAT();
      }


    });

  };

};
