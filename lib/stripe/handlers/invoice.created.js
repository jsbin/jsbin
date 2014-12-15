'use strict';
var stripe = require('stripe');
var Promise = require('promise');
var validateVAT = require('validate-vat');
var models = require('../../models');


module.exports = function (stripe) {

  return function (req, event, done) {

    done(null)

  };

};
