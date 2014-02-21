'use strict';
var hbs = require('hbs'),
    features = require('./features');

hbs.registerHelper('feature', function(user, flag, options) {
  if (features(flag, { session: { user: user } })) {
    return options.fn(this);
  }
});


module.exports = hbs;