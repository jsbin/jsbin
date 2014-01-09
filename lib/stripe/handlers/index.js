//Inspiration from http://gaarf.info/2013/06/25/securing-stripe-webhooks-with-node-js/

// Remove once finished testing
var cardToFail = {
  number: '4000000000000341',
  exp_month: 08,
  exp_year: 2018,
  cvc: 857
};

module.exports = function (config) {

  var stripe = require('stripe')(config.secret),
    models = require('../../models'),
    stripeTransactions = {
      'unhandled':                  require('./unhandled.js'),
      'charge.succeeded':           require('./charge.succeeded.js'),
      'invoice.payment_succeeded':  require('./invoice.payment_succeeded.js')
    };

  return {

    authEvent: function(req, res, next) {
      
      if (req.body.object !== 'event') {
        return res.send(400); // invalid data    
      }

      stripe.events.retrieve(req.body.id, function(err, event) {
        
        // err = invalid event, !event = error from stripe
        if (err || !event) {
          return res.send(401); 
        }

        req.stripeEvent = event;
        next();

      });

    },

    handleTransaction: function(req, res) {

      var event = req.stripeEvent,
          data = event.data.object; 

      // takes care of unexpected event types
      var transactionMethod = stripeTransactions[event.type] || stripeTransactions.unhandled;

      transactionMethod(data, function(err){
        if ( !err ) {
          res.send(200);
        }
      });

    },

    handleSubscription: function(req, res) {
      var user = req.session.user,
        customerOptions = {
          plan: req.params.plan,
          card: req.body.stripeToken
        };
      if (!user) {
        res.flash('error', 'Please login before attemptind to signup');
        res.redirect('/');
        return;
      }

      function handleCardError(err) {
        // error with customer creation
        console.log('Card has been declined');
        res.flash('error', err.message);
        res.redirect('/');
      }

      function setUserToPro () {
        models.user.setProAccount(user.name, true, function(err) {
          if (!err) {
            req.session.user.pro = true;
            req.flash('notification', 'Welcome to the pro user lounge. Your seat is waiting');
          } else {
            req.flash('error', 'Something went wrong, please try signing in and out again');
            // TODO :: serious exception - need to make sure once paid they are a PRO
          }
          res.redirect('/');
        });
      }

      function createCustomer (data) {
        models.customer.setCustomer({
          stripeId: data.customer || data.id,
          user: user.name,
          plan: customerOptions.plan
        });
      }


      models.customer.getCustomerByUser(user, function(err, customer) {
  
        /** just a thought, make this code generic between old and new customers - much easier to debug that way
        var stripePromise = customer ? 
          stripe.customers.updateSubscription(customer.stripe_id, customerOptions) :
          stripe.customers.create(customerOptions);
          */

        if (customer) {
          stripe.customers.updateSubscription(customer.stripe_id, customerOptions)
            .then(setUserToPro, handleCardError);
        } else {
          stripe.customers.create(customerOptions)
            .then(setUserToPro, handleCardError)
            .then(function (customer) {
              models.customer.setCustomer({
                user: user.name,
                stripeId: customer.id
              });
            });
        }
      });

    }

  };
};
