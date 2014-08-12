'use strict';
var undefsafe = require('undefsafe');
var config = require('../config');
var stripeKey = undefsafe(config, 'payment.stripe.public');
var models = require('../models');
var metrics = require('../metrics');
var customer = models.customer;
var vatValidator = require('validate-vat');
var features = require('../features');
var featureList = require('../data/features.json');
var backersList = require('../data/backers.json');
var Promise = require('promise'); // jshint ignore:line
var util = require('util');

// PROMISE ALL THE THINGS! \o/
var getCustomerByUser = Promise.denodeify(customer.getCustomerByUser).bind(customer);
var setCustomer = Promise.denodeify(customer.setCustomer).bind(customer);
var setProAccount = Promise.denodeify(models.user.setProAccount).bind(models.user);

var stripe;

var debug = config.environment !== 'production';

if (stripeKey) {
  stripe = require('stripe')(undefsafe(config, 'payment.stripe.secret'));
}

// this is a compatibility layer for our handler index.js magic
var upgrade = module.exports = {
  name: 'upgrade'
};

upgrade.admin = {};

upgrade.admin.createPlans = function (req, res, next) {
  if (!features('admin', req) || config.environment === 'production') {
    return next(403);
  }

  var plans = [{
    amount: 600,
    interval: 'month',
    name: 'Pro monthly',
    currency: 'gbp',
    id: 'pro',
    statement_description: 'JS BIN PRO' // jshint ignore:line
  }, {
    amount: 720,
    interval: 'month',
    name: 'Pro monthly + VAT',
    currency: 'gbp',
    id: 'pro_vat',
    statement_description: 'JS BIN PRO+VAT' // jshint ignore:line
  }, {
    amount: 6000,
    interval: 'year',
    name: 'Pro yearly',
    currency: 'gbp',
    id: 'pro_yearly',
    statement_description: 'JS BIN PRO' // jshint ignore:line
  }, {
    amount: 7200,
    interval: 'year',
    name: 'Pro yearly + VAT',
    currency: 'gbp',
    id: 'pro_yearly_vat',
    statement_description: 'JS BIN PRO+VAT' // jshint ignore:line
  }];

  new Promise(function (resolve) {
    resolve(Promise.all(plans.map(function (plan) {
      return stripe.plans.create(plan);
    })));
  }).then(function (results) {
    res.send(results);
  }).catch(function (error) {
    res.statusCode = 200;
    res.json(error);
  });

};

upgrade.subscription  = function (req, res, next) {
  if (!stripeKey) {
    return next('route');
  }

  metrics.increment('upgrade.view.subscription');

  var app = req.app;

  getCustomerByUser(req.session.user).then(function (results) {
    var result = results[0];
    if (debug) {console.log('.then, stripe.customers.retrieve(' + result.stripe_id + ')');} // jshint ignore:line
    return stripe.customers.listSubscriptions(result.stripe_id);// jshint ignore:line
  }).then(function (results) {
    var data = results.data;

    if (data && Array.isArray(data) && data.length) {
      return data;
    } else {
      throw new Error('customer loaded, stripe customer loaded, but no stripe data found');
    }
  }).then(function (data) {
    data.forEach(function (data) {
      if (data.plan.id.indexOf('vat') !== -1) {
        data.plan.vat = data.plan.amount - (data.plan.amount / 6);
      }
    });

    // render the view
    res.render('account/subscription', {
      layout: 'sub/layout',
      root: app.locals.url('', true, req.secure),
      static: app.locals.urlForStatic('', req.secure),
      cacheBust: app.set('is_production') ? '?' + req.app.set('version') : '',
      request: req,
      subscription: data[0], //only send the first
      csrf: req.session._csrf,
      username: req.session.user.name,
    });

  }).catch(function (error) {
    // single catch for all error types
    console.error(error.stack);
    req.flash(req.flash.ERROR, 'Your customer records could not be loaded. If you believe this is an error please contact <a href="mailto:support@jsbin.com?subject=Failed VAT">support</a>.');

    next('route');
  });
};

upgrade.cancel = function (req, res) {
  getCustomerByUser(req.session.user).then(function (results) {
    var result = results[0];
    if (debug) {console.log('.then, stripe.customers.retrieve(' + result.stripe_id + ')');} // jshint ignore:line
    return stripe.customers.cancelSubscription(result.stripe_id, req.body.subscription, { at_period_end: true });// jshint ignore:line
  }).then(function () {
    req.flash(req.flash.ERROR, 'Your Pro subscription has been cancelled, and your Pro status will be removed at the end of your billing period. We miss you already...');
    res.redirect('/');

  }).catch(function (error) {
    console.error(error.stack);
    res.send(500);
  });
};

upgrade.features = function (req, res, next) {
  if (!stripeKey) {
    return next('route');
  }

  metrics.increment('upgrade.view.features');

  var app = req.app;
  var stripeProMonthURL = undefsafe(config, 'payment.stripe.urls.month');

  res.render('features', {
    layout: 'sub/layout',
    root: app.locals.url('', true, req.secure),
    static: app.locals.urlForStatic('', req.secure),
    referrer: req.get('referer'),
    featureList: featureList,
    backersList: backersList,
    cacheBust: app.set('is_production') ? '?' + req.app.set('version') : '',
    stripeKey: stripeKey,
    stripeProMonthURL: stripeProMonthURL
  });
};

upgrade.payment = function (req, res, next) {
  if (!stripeKey) {
    return next('route');
  }

  if (!req.body.email) {
    metrics.increment('upgrade.view.pay');
  } else {
    metrics.increment('upgrade.view.pay.try-again');
  }

  var app = req.app;
  var user = undefsafe(req, 'session.user') || {};

  var info = req.flash(req.flash.INFO);
  var error = req.flash(req.flash.ERROR);
  var notification = req.flash(req.flash.NOTIFICATION);

  var flash = error || notification || info;

  if (req.query.coupon && req.query.coupon !== 'true') {
    req.body.coupon = req.query.coupon;
  }

  res.render(features('upgradeWithFeatures', req) ? 'upgrade' : 'payment', {
    featureList: featureList,
    user: !!req.session.user,
    flash: flash,
    request: req,
    layout: 'sub/layout',
    root: app.locals.url('', true, req.secure),
    static: app.locals.urlForStatic('', req.secure),
    referrer: req.get('referer'),
    csrf: req.session._csrf,
    values: {
      email: req.body.email || user.email,
      vat: req.body.vat,
      country: req.body.country,
      subscription: req.body.subscription,
      number: req.body.number,
      expiry: req.body.expiry,
      cvc: req.body.cvc,
      coupon: req.body.coupon,
      buyer_type: req.body.buyer_type, // jshint ignore:line
    },
    stripe: {
      key: stripeKey,
    },
    cacheBust: req.app.set('is_production') ? '?' + req.app.set('version') : '',
    showCoupon: req.query.coupon === 'true' || undefsafe(req, 'body.coupon')
  });
};

upgrade.processPayment = function (req, res, next) {
  if (!stripeKey) {
    return next('route');
  }

  var plans = undefsafe(config, 'payment.stripe.plans');

  if (!plans) {
    return next(412, 'Missing stripe plans'); // 412: precondition failed
  }

  var metadata = {
    type: req.body.buyer_type || 'individual', // jshint ignore:line
    country: req.body.country,
    vat: req.body.vat,
    username: req.session.user.name,
  };

  // Get the credit card details submitted by the form
  var stripSubscriptionData = {
    email: req.body.email,
    card: req.body.stripeToken,
    metadata: metadata,
  };

  if (req.body.coupon) {
    stripSubscriptionData.coupon = req.body.coupon;
  }

  function getPlan(customer) {
    var yearly = req.body.subscription === 'yearly';
    var card = customer.default_card; // jshint ignore:line
    var planOptions = yearly ? plans.yearly : plans.monthly;
    var EU = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES', 'FI', 'FR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK']; //

    var country = customer.cards.data.reduce(function (last, current) {
      if (current.id === card) {
        return current.country;
      } else {
        return last;
      }
    }, null);

    var p = planOptions.simple;

    // if country === UK - add VAT
    if (country) {
      if (country === 'GB') {
        p = planOptions.vat;
      } else if (EU.indexOf(country) !== -1) {
        if (!req.vatValid) {
          p = planOptions.vat;
        }
      }
    }

    return p;
  }

  new Promise(function (resolve) {
    if (req.body.vat) {
      // check country against the country against the card - it should match
      // if it fails, we swallow and respond
      var country = (req.body.country || '').toUpperCase();
      var vat = (req.body.vat||'').replace(/\s/g, '');
      vatValidator(country, vat, function (error, result) {
        // IMPORTANT: this is where we are swallowing the promise, and not carrying on
        if (error || result.valid === false) {
          metrics.increment('upgrade.fail.vat');
          req.flash(req.flash.ERROR, 'VAT did not appear to be valid, can you try again or follow up with <a href="mailto:support@jsbin.com?subject=Failed VAT">support</a>.');
          return upgrade.payment(req, res, next);
        }

        req.vatValid = true;
        resolve();
      });
    } else {
      // passthrough
      resolve();
    }
  }).then(function () {
    // 1. create (or get) customer
    // 2. update customer with card and details
    // 3. subscribe to plan (and adjust their VAT based on the country of the card)

    /** 1. get a stripe customer id */
    if (debug) {console.log('getCustomerByUser');}
    return getCustomerByUser(req.session.user).then(function (results) {
      var result = results[0];
      if (debug) {console.log('.then, stripe.customers.retrieve(' + result.stripe_id + ')');} // jshint ignore:line
      return stripe.customers.retrieve(result.stripe_id).then(function (stripeCustomer) { // jshint ignore:line
        if (debug) {console.log('.then, subscribe');}
        // change their subscription
        // FIXME this *assumes* that the customer is subscribed to a plan...
        if (stripeCustomer.subscriptions && stripeCustomer.subscriptions.data.length) {
          return stripe.customers.updateSubscription(stripeCustomer.id, stripeCustomer.subscriptions.data[0].id, { plan: getPlan(stripeCustomer) });
        } else {
          return stripe.customers.createSubscription(stripeCustomer.id, { plan: getPlan(stripeCustomer) });
        }
      }).catch(function (error) {
        // failed to subscribe existing user to stripe
        metrics.increment('upgrade.fail.existing-user-change-subscription');
        console.error('upgrade.fail.existing-user-change-subscription');
        console.error(error.stack);
      });
    }).catch(function () {
      if (debug) {console.log('.catch, stripe.customers.create(' + JSON.stringify(stripSubscriptionData) + ')');}
      // create the customer with Stripe since they don't exist
      return stripe.customers.create(stripSubscriptionData).then(function (stripeCustomer) {
        if (debug) {console.log('.then, stripe.customers.createSubscription(' + stripeCustomer.id + ', { plan: ' + getPlan(stripeCustomer) + ' })');}
        return stripe.customers.createSubscription(stripeCustomer.id, { plan: getPlan(stripeCustomer) }).then(function () {
          if (debug) {console.log('.then, setCustomer');}
          return setCustomer({
            stripeId: stripeCustomer.id,
            user: req.session.user.name,
            plan: getPlan(stripeCustomer)
          });
        });
      });
    }).then(function (data) {
      if (debug) {
        console.log('.then, setProAccount(' + req.session.user.name + ', true)');
        console.log(util.inspect(data, { depth: 50 }));
        console.log('stripe all done - now setting user to pro!');
      }

      return setProAccount(req.session.user.name, true);
    }).then(function () {
      metrics.increment('upgrade.success');
      req.session.user.pro = true;

      var analytics = 'window._gaq && _gaq.push(["_trackEvent", "upgrade", "' + req.body.subscription + '"';

      if (req.body.coupon) {
        analytics += ',"coupon", "' + req.body.coupon + '"'
      }

      analytics += ']);';

      req.flash(req.flash.NOTIFICATION, 'Welcome to the pro user lounge. Your seat is waiting. In the mean time, <a target="_blank" href="http://jsbin.com/help/pro">find out more about Pro accounts</a><script>' + analytics + '</script>');
      res.redirect('/');
    }).catch(function (error) {
      // there was something wrong with the customer create process, so let's
      // send them back to the payment page with a flash message
      var message = 'Unknown error in the upgrade process. Please try again or contact support';
      if (error && error.message) {
        message = error.message;
      } else if (error) {
        message = error.toString();
      }
      if (error.type) {
        metrics.increment('upgrade.fail.' + error.type);
      } else {
        metrics.increment('upgrade.fail.transaction-misc');
      }

      req.flash(req.flash.ERROR, message);
      upgrade.payment(req, res, next);
    });
  }).catch(function (error) {
    // this is likely to be an exception in our code. ![Dangit](http://i.imgur.com/Cj57XRN.gif)
    console.error('uncaught exception in upgrade', error);

    metrics.increment('upgrade.fail.exception-in-code');

    var message = 'Unknown error in the upgrade process. Please try again or contact support';
    if (error && error.message) {
      message = error.message;
    } else if (error) {
      message = error.toString();
    }

    req.flash(req.flash.ERROR, 'Exception in upgrade process: ' + message);
    upgrade.payment(req, res, next);
  });
};
