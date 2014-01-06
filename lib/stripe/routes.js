module.exports = function routes(app, config) {

  // pass handlers the app object so they have access to the stripe API key
  var stripeHandler = require('./handlers')(config);

  app.post('/stripe/webhook', stripeHandler.authEvent, stripeHandler.handleTransaction);

};
