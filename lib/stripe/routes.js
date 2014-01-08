module.exports = function routes(app, config) {

  // pass handlers the app object so they have access to the stripe API key
  var stripeHandler = require('./handlers')(config);

  app.post('/hooks/stripe', stripeHandler.authEvent, stripeHandler.handleTransaction);

  app.post('/charge', stripeHandler.handleSubscription);

};
