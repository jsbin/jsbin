'use strict';
var features = require('../features.js');

module.exports = function routes(app, config) {

  // pass handlers the app object so they have access to the stripe API key
  var stripeHandler = require('./handlers')(config);

  app.post('/hooks/stripe', stripeHandler.authEvent, stripeHandler.handleTransaction);

  app.post('/subscribe/:plan', stripeHandler.handleSubscription);

  app.get('/signup', features.route('stripe'), stripeHandler.renderSignUp);

};
