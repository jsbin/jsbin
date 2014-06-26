'use strict';

var undefsafe = require('undefsafe');
var config = require('../config');
var featureList = require('../data/features.json');
var backersList = require('../data/backers.json');

var upgrade = module.exports = {
  name: 'upgrade'
};

upgrade.features = function (req, res) {
  var stripeKey = undefsafe(config, 'payment.stripe.public');
  var stripeProMonthURL = undefsafe(config, 'payment.stripe.urls.month');

  var app = req.app;

  res.render('upgrade', {
    layout: 'sub/layout',
    root: app.locals.url('', true, req.secure),
    static: app.locals.urlForStatic('', req.secure),
    referrer: req.get('referer'),
    featureList: featureList,
    backersList: backersList,
    cachebust: app.set('is_production') ? '?' + req.app.set('version') : '',
    stripeKey: stripeKey,
    stripeProMonthURL: stripeProMonthURL,
    showCoupon: req.query.coupon === 'true'
  });
};

upgrade.payment = function (req, res) {
  var app = req.app;
  var stripeKey = undefsafe(config, 'payment.stripe.public');
  var stripeProMonthURL = undefsafe(config, 'payment.stripe.urls.month');
  var stripeProYearURL = undefsafe(config, 'payment.stripe.urls.year');

  res.render('payment', {
    request: req,
    user: undefsafe(req, 'session.user'),
    layout: 'sub/layout',
    root: app.locals.url('', true, req.secure),
    static: app.locals.urlForStatic('', req.secure),
    referrer: req.get('referer'),
    featureList: featureList,
    backersList: backersList,
    stripe: {
      key: stripeKey,
      monthly: stripeProMonthURL,
      yearly: stripeProYearURL
    },
    cachebust: app.set('is_production') ? '?' + req.app.set('version') : '',
    showCoupon: req.query.coupon === 'true'
  });
};







