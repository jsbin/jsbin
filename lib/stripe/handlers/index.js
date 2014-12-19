'use strict';
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
        console.log(err);
        res.send(500, err);
      });

    },

// superceeded by handlers/upgrade.js
/*    handleSubscription: function (req, res) {
      var user = req.session.user;
      var customerOptions = {
        plan: req.params.plan,
        card: req.body.stripeToken
      };
      var couponCode = req.url.indexOf('?') !== -1 ? req.url.split('?').pop() : null;
      if (couponCode) {
        customerOptions.coupon = couponCode;
      }

      if (!user) {
        res.flash('error', 'Please login before attempting to signup');
        res.redirect('/');
        return;
      }

      function handleCardError(err) {
        // error with customer creation
        res.flash('error', err.message);
        res.redirect('/');
      }

      function setUserToPro(data) {
        return new Promise(function (resolve, reject) {
          models.user.setProAccount(user.name, true, function (err) {
            if (!err) {
              req.session.user.pro = true;
              req.flash(req.flash.NOTIFICATION, 'Welcome to the pro user lounge. Your seat is waiting');
              resolve(data);
            } else {
              req.flash(req.flash.ERROR, 'Something went wrong, we\'ll work on fixing this ASAP');
              reject(err);
              // TODO :: serious exception - need to make sure once paid they are a PRO
            }
          });
        });
      }

      function createCustomer(data) {
        models.customer.setCustomer({
          stripeId: data.customer || data.id,
          user: user.name,
          plan: customerOptions.plan
        }, function (err){
          if (!err) {
            return res.redirect('/');
          }
        });
      }


      models.customer.getCustomerByUser(user, function (err, customer) {

        var chargeForSubscription = customer[0] ?
          stripe.customers.updateSubscription(customer[0].stripe_id, customerOptions) : // jshint ignore:line
          stripe.customers.create(customerOptions);

        chargeForSubscription
          .then(setUserToPro, handleCardError)
          .then(createCustomer);

      });

    },
*/
  };
};
