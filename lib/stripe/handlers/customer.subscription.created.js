'use strict';
var debug = require('debug')('jsbin:upgrade');
var request = require('request');
var emailSender = require('../../email');

module.exports = function (stripe) {
  return function (req, data, done) {
    var customerId = data.customer;
    debug('stripe.customers.retrieve(%s)', customerId);

    done(null, true);

    stripe.customers.retrieve(customerId).then(function (customer) {
      // check the customer against github and see if
      // they have any repos, stars follows etc.
      // and email the profile to myself
      request({
        url: 'https://api.github.com/users/' + customer.metadata.username,
        headers: {
          'user-agent': 'jsbin',
          'accept': 'application/vnd.github.v3+json',
        },
        json: true
      }, function (error, response, body) {
        console.log(data);
        body.username = body.login;
        body.plan = data.plan;
        emailSender.send({
          filename: 'new-customer-report',
          data: body,
          to: 'info@jsbin.com',
          subject: 'new customer report',
        }).catch(function (e) {
          console.log('customer report failed');
          console.log(e.stack);
        });

      });
    });
  }
}

