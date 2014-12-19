'use strict';
var hbs = require('hbs');
var features = require('./features');
var moment = require('moment');
var path = require('path');
var config = require('./config');

hbs.registerPartials(path.resolve(__dirname + '/../views/partials'));

if (config.env !== 'production') {
  var hbsutils = require('hbs-utils')(hbs);
  hbsutils.registerWatchedPartials(path.resolve(__dirname + '/../views/partials'));
}

hbs.registerHelper('feature', function(request, flag, options) {
  if (features(flag, request)) {
    return options.fn(this);
  } else if (options.inverse) {
    return options.inverse(this);
  }
});

hbs.registerHelper('eachkey', function eachKey(object) {
  var options = arguments[arguments.length - 1];
  var ret = '';
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      ret += options.fn({
        key: key,
        value: object[key]
      });
    }
  }
  return ret;
});

hbs.registerHelper('encodeURIComponent', function(options) {
  return encodeURIComponent(options.fn(this));
});


hbs.registerHelper('stripeTimestampAsDate', function(timestamp, format, options) {
  return moment(timestamp * 1000).format(format);
});

hbs.registerHelper('divide', function(x, y, dp, options) {
  return (x/y).toFixed(dp) + options.fn(this);
});

hbs.registerHelper('amountPaid', function (invoice) {
  return invoice.total - invoice.amount_due;
});

hbs.registerHelper('percent', function (total, percent, dp) {
  console.log(total, percent);
  return ((total / 100) * (percent / 100)).toFixed(dp);
});

hbs.registerHelper('equal', function(lvalue, rvalue, options) {
  if (arguments.length < 3) {
    return false;
  }
  if (lvalue !== rvalue) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

hbs.registerHelper('dump', function(obj) {
  return JSON.stringify(obj, null, 2);
});

hbs.registerPartial('welcome_panel', __dirname + '/../views/partials/welcome-panel.html');

module.exports = hbs;