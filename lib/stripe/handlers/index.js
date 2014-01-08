//Inspiration from http://gaarf.info/2013/06/25/securing-stripe-webhooks-with-node-js/


module.exports = function (config) {

  var stripe = require('stripe')(config.secret),
    models = require('../../models'),
    stripeTransactions = {
      'unhandled':          require('./unhandled.js'),
      'charge.succeeded':   require('./charge.succeeded.js')
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
      console.log(req.headers);
      console.log(user);
      console.log(stripeToken);
      if (!user) {
        // please login before subscribing to jsbin
        // TODO
      }

      stripe.customers.create({
        card: stripeToken,
        plan: 'test_pro'
      }).then(function (err, customer) {
        if (!err) {
          req.session.user.pro = true;
          models.customer.setCustomer({
            user: user.name,
            stripeId: customer.id
          });
        }
      });

      res.redirect('/');

    }

  };
};
