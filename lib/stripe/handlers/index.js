//Inspiration from http://gaarf.info/2013/06/25/securing-stripe-webhooks-with-node-js/


module.exports = function (config) {

  var stripe = require('stripe')(config.secret),
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

    }

  };
};
