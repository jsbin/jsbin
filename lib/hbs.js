'use strict';
var hbs = require('hbs'),
    features = require('./features'),
    path = require('path');

hbs.registerPartials(path.resolve(__dirname + '/../views/partials'));

hbs.registerHelper('feature', function(request, flag, options) {
  if (features(flag, request)) {
    return options.fn(this);
  } else if (options.inverse) {
    return options.inverse(this);
  }
});

hbs.registerHelper('dump', function(obj) {
  return JSON.stringify(obj, null, 2);
});

module.exports = hbs;