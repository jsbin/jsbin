//Inspiration from http://gaarf.info/2013/06/25/securing-stripe-webhooks-with-node-js/


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
          stripeToken = req.body.stripeToken;
      if (!user) {
        // please login before subscribing to jsbin
        // TODO
      }

      var cardToFail = {
        number: '4000000000000341',
        exp_month: 08,
        exp_year: 2018,
        cvc: 857
      };

      stripe.customers.create({
        card: cardToFail, //stripeToken,
        plan: 'test_pro'
      }).then(function (customer) {

        models.user.setProAccount(user.name, true, function(err) {
          if (!err) {
            req.session.user.pro = true;
            req.flash('notification', 'Welcome to the pro user lounge. Your seat is waiting');
          } else {
            req.flash('error', 'Something went wrong, please try signing in and out again');
          }
          res.redirect('/');
        });

        models.customer.setCustomer({
          user: user.name,
          stripeId: customer.id
        });

      }, function(err) {
        // error with customer creation
        if(err.code === "card_declined") {
          console.log("Card has been declined");
          res.flash('error', err.message);
          res.redirect('/');
        }
      });


    }

  };
};
