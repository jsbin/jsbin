'use strict';

module.exports = function routes(app, config) {

  // pass handlers the app object so they have access to the stripe API key
  var stripeHandler = require('./handlers')(config);

  // following POSTs come directly from stripe
  app.post('/hooks/stripe', stripeHandler.authEvent, stripeHandler.handleTransaction);
  // app.post('/subscribe/:plan', stripeHandler.handleSubscription);
};
