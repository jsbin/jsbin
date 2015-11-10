'use strict';
var debug = require('debug')('jsbin:upgrade');
//Inspiration from http://gaarf.info/2013/06/25/securing-stripe-webhooks-with-node-js/

// Remove once finished testing
// var cardToFail = {
//   number: '4000000000000341',
//   exp_month: 08,
//   exp_year: 2018,
//   cvc: 857
// };

var Promise = require('rsvp').Promise;

module.exports = function (config) {

  var stripe = require('stripe')(config.secret);
  var models = require('../../models');
  var stripeTransactions = {
    'unhandled': require('./unhandled.js'),
    'customer.subscription.deleted': require('./customer.subscription.deleted'),
    'invoice.created': require('./invoice.created')(stripe),
  };

  return {
    authEvent: function (req, res, next) {
      if (req.body.object !== 'event') {
        return res.send(400); // invalid data
      }

      stripe.events.retrieve(req.body.id, function (err, event) {
        // err = invalid event, !event = error from stripe
        debug(err, event);
        if (err || !event) {
          return res.send(401);
        }

        req.stripeEvent = event;
        next();
      });
    },

    // stripe sent us a webhook, so respond appropriately
    handleTransaction: function (req, res) {

      var event = req.stripeEvent;
      var data = event.data.object;

      // takes care of unexpected event types
      var transactionMethod = stripeTransactions[event.type] || stripeTransactions.unhandled;

      transactionMethod(req, data, function (err){
        if ( !err ) {
          return res.send(200);
        }
        console.log('stripe webhook error');
        console.log(event.type);
        console.log(err);
        res.send(500, err);
      });

    },

  };
};
