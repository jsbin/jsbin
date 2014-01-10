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
      'customer.subscription.deleted':  require('./customer.subscription.deleted')
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

      function setUserToPro (data) {
        models.user.setProAccount(user.name, true, function(err) {
          if (!err) {
            req.session.user.pro = true;
            req.flash('notification', 'Welcome to the pro user lounge. Your seat is waiting');
          } else {
            req.flash('error', 'Something went wrong, we\'ll work on fixing this ASAP');
            // TODO :: serious exception - need to make sure once paid they are a PRO
          }
          res.redirect('/');
        });
        return data;
      }

      function createCustomer (data) {
        models.customer.setCustomer({
          stripeId: data.customer || data.id,
          user: user.name,
          plan: customerOptions.plan
        });
      }


      models.customer.getCustomerByUser(user, function(err, customer) {
  
        var chargeForSubscription = customer[0] ? 
          stripe.customers.updateSubscription(customer[0].stripe_id, customerOptions) :
          stripe.customers.create(customerOptions);

        chargeForSubscription
          .then(setUserToPro, handleCardError)
          .then(createCustomer);
          //.then(); when we implement team stuff;

      });

    },

    renderSignUp: function(req, res) {
      res.render('signup', {}); 
    }

  };
};
