'use strict';
var VATRates = require('./vat-rates.json').rates;

function getVATByCountry(countrycode) {
  /* RS: left this in as a reminder of simpler times :'(
  var now = new Date();
  if (now.getFullYear() < 2015) {
    return Promise.resolve(0.2);
  }
  */
  var rate = VATRates[countrycode].standard_rate / 100;
  return Promise.resolve(rate);
}

function countryIsInEU(countrycode) {
  var EU = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES', 'FI', 'FR', 'GB', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'];
  return EU.indexOf((countrycode||'').toUpperCase()) !== -1;
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

exports.getVATByCountry = getVATByCountry;
exports.countryIsInEU = countryIsInEU;
exports.getCountry = getCountry;
