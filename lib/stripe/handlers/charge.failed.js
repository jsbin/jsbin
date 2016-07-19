/* global Promise */
var emailSender = require('../../email');
var moment = require('moment');
var debug = require('debug')('jsbin:upgrade');

module.exports = function (stripe) {
  return function (req, data, done) {
    debug('charge.failed: start');
    return stripe.customers.retrieve(data.customer).then(function (res) {
      var email = {
        filename: 'charge-failed',
        to: res.email,
        subject: 'Recent failed change on your subscription',
        data: {
          user: {
            name: res.metadata.username,
          },
          last4: data.card.last4,
          created: moment(data.created * 1000).format('D-MMM [at] ha'),
        },
      };
      return emailSender.send(email);
    }).then(function () {
      done(null);
    }).catch(done);
  };
};
