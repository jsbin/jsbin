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
var featureListAlt = require('../data/features-alt.json');
// var backersList = require('../data/backers.json');
var util = require('util');
var stripeUtils = require('../stripe/utils');
var _ = require('underscore');
var debug = require('debug')('jsbin:upgrade');

// PROMISE ALL THE THINGS! \o/
var getCustomerByUser = Promise.denodeify(customer.getCustomerByUser).bind(customer);
var setCustomer = Promise.denodeify(customer.setCustomer).bind(customer);
var setProAccount = Promise.denodeify(models.user.setProAccount).bind(models.user);

var stripe;

// var debug = config.environment !== 'production';

if (stripeKey) {
  stripe = require('stripe')(undefsafe(config, 'payment.stripe.secret'));
}

// this is a compatibility layer for our handler index.js magic
var upgrade = module.exports = {
  name: 'upgrade',
};

upgrade.admin = {};

upgrade.updateCard = function (req, res, next) {
  if (!stripeKey) {
    return next('route');
  }

  metrics.increment('upgrade.update.card');

  getCustomerByUser(req.session.user).then(function (results) {
    var user = results[0];

    return stripe.customers.update(user.stripe_id, {
      source: req.body.stripeToken
    });
  }).then(function () {
    if (req.ajax) {
      return res.send(true);
    }
    req.flash(req.flash.INFO, 'Card details updated');
    res.redirect('/account/subscription');
  }).catch(function (error) {
    console.log(req.url);
    console.log(error.stack);
    if (req.ajax) {
      res.status(500).send({
        error: error.message
      });
    } else {
      next(error);
    }
  });
};

upgrade.subscription = function (req, res, next) {
  if (!stripeKey) {
    return next('route');
  }

  metrics.increment('upgrade.view.subscription');

  var app = req.app;

  // Promise.resolve(require(__dirname + '/../../tmp/invoice.json'))
  getCustomerByUser(req.session.user).then(function (results) {
    var result = results[0];

    var p1 = stripe.invoices.list({
      limit: 100,
      customer: result.stripe_id // jshint ignore:line
    });

    var p2 = stripe.charges.list({
      limit: 1,
      customer: result.stripe_id // jshint ignore:line
    });
    var p3 = stripe.customers.retrieve(result.stripe_id);

    return Promise.all([p1, p2, p3]);
  })
  .then(function (results) {
    return {
      invoices: results[0].data,
      charge: results[1].data[0],
      subscriptions: results[2].subscriptions,
      customer: results[2]
    };
  })
  .then(function (results) {
    var data = results.subscriptions.data;

    if (data && Array.isArray(data) && data.length) {
      return results;
    } else {
      throw new Error('customer loaded, stripe customer loaded, but no stripe data found');
    }
  }).then(function (results) {
    var data = results.subscriptions.data;
    results.subscriptions.data = data.map(function (data) {
      if (data.plan.id.indexOf('vat') !== -1) {
        data.plan.vat = data.plan.amount - (data.plan.amount / 6);
      }
      return data;
    });
    return results;
  }).then(function (data) {
    // render the view
    res.render('account/subscription', {
      title: 'Your subscription',
      layout: 'sub/layout.html',
      root: app.locals.url('', true, req.secure),
      static: app.locals.urlForStatic('', req.secure),
      request: req,
      stripe: {
        key: stripeKey,
      },
      subscription: data.subscriptions.data[0], //only send the first
      invoices: data.invoices,
      charge: data.charge,
      card: data.customer.cards.data[0], // only send first card
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

upgrade.invoice = function (req, res) {
  getCustomerByUser(req.session.user).then(function (results) {
    var invoice_id = req.params.invoice; // jshint ignore:line
    return stripe.invoices.retrieve(invoice_id).then(function (invoice) { // jshint ignore:line
      if (invoice.customer !== results[0].stripe_id) { // jshint ignore:line
        throw 'Unauthorized';
      }
      return invoice;
    });
  }).then(function (invoice) {
    res.render('invoice', {
      invoice: invoice
    });
  }).catch(function (err) {
    console.log(err.stack);
    req.flash(req.flash.ERROR, 'Unauthorised request to url');
    res.redirect('/login');
  });
};

upgrade.cancel = function (req, res, next) {
  return getCustomerByUser(req.session.user).then(function (results) {
    var result = results[0];
    debug('.then, stripe.customers.retrieve(' + result.stripe_id + ')'); // jshint ignore:line
    return stripe.customers.cancelSubscription(result.stripe_id, req.body.subscription, { at_period_end: true });// jshint ignore:line
  }).then(function () {
    req.flash(req.flash.ERROR, 'Your Pro subscription has been cancelled, and your Pro status will be removed at the end of your billing period. We miss you already...');
    if (next) {
      next();
    }
  }).catch(function (error) {
    console.error(error.stack);
    if (next) {
      return next(error);
    } else {
      res.send(500);
    }
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
    title: 'Pro features',
    layout: 'sub/layout.html',
    root: app.locals.url('', true, req.secure),
    static: app.locals.urlForStatic('', req.secure),
    referrer: req.get('referer'),
    featureList: featureList.features,
    tweets: _.shuffle(featureList.tweets).slice(0, 3),
    backersList: backersList,
    stripeKey: stripeKey,
    stripeProMonthURL: stripeProMonthURL,
    description: 'JS Bin Pro Accounts: Pro accounts keep JS Bin 100% free for education, and give you dropbox sync, private bins, vanity urls, asset uploading and supports JS Bin\'s continued operation'
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

  var promise;
  var discount;

  if (req.query.coupon && req.query.coupon !== 'true') {
    req.body.coupon = req.query.coupon;
    promise = new Promise(function (resolve) {
      stripe.coupons.retrieve(req.query.coupon, function(error, coupon) {
        if (error || coupon.valid === false) {
          delete req.body.coupon;
        } else {
          if (coupon.percent_off) {
            discount = coupon.percent_off + '% off';
          } else if (coupon.amount_off) {
            discount = '£' + coupon.amount_off + ' off';
          }

          if (coupon.duration_in_months) {
            discount += ' the first ' + coupon.duration_in_months + ' months';
          }
        }

        resolve();
      });
    });

  } else {
    promise = Promise.resolve();
  }

  var testUnlimited = features('testUnlimited', req);
  var featureListToUse = testUnlimited ?
        featureListAlt.features : featureList.features;

  promise.then(function () {
    res.render('upgrade', {
      title: 'Upgrade to Pro',
      testUnlimited: testUnlimited,
      featureList: featureListToUse.slice(0),
      user: req.session.user,
      flash: flash,
      request: req,
      layout: 'sub/layout.html',
      root: app.locals.url('', true, req.secure),
      static: app.locals.urlForStatic('', req.secure),
      referrer: req.get('referer'),
      csrf: req.session._csrf,
      tweets: _.shuffle(featureList.tweets).slice(0, 4),
      values: {
        email: req.body.email || user.email,
        vat: req.body.vat,
        country: req.body.country,
        subscription: req.body.subscription,
        number: req.body.number,
        expiry: req.body.expiry,
        cvc: req.body.cvc,
        coupon: req.body.coupon,
        discount: discount,
        buyer_type: req.body.buyer_type, // jshint ignore:line
      },
      stripe: {
        key: stripeKey,
      },
      showCoupon: req.query.coupon === 'true' || undefsafe(req, 'body.coupon'),
      description: 'JS Bin Pro Accounts: Pro accounts keep JS Bin 100% free for education, and give you dropbox sync, private bins, vanity urls, asset uploading and supports JS Bin\'s continued operation'
    });
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

  if (req.error) {
    return upgrade.payment(req, res, next);
  }

  var metadata = {
    type: req.body.buyer_type || 'individual', // jshint ignore:line
    country: req.body.country,
    vat: req.body.vat,
    username: req.session.user.name,
    id: req.session.user.id,
    ip: req.ip,
  };

  // get the credit card details submitted by the form
  var stripSubscriptionData = {
    email: req.body.email,
    card: req.body.stripeToken,
    metadata: metadata,
  };

  // if the user doesn't have an email address (likely they came from github)
  // then let's update it now
  if (!req.session.user.email) {
    models.user.updateOwnershipData(req.session.user.name, {
      email: req.body.email,
    }, function () {
      req.session.user.email = req.body.email;
      req.session.user.avatar = req.app.locals.gravatar(req.session.user);
    });
  }

  if (req.body.coupon) {
    stripSubscriptionData.coupon = req.body.coupon;
  }

  function getPlan() {
    var yearly = req.body.subscription === 'yearly';
    var planOptions = yearly ? plans.yearly : plans.monthly;
    return planOptions.simple;
  }

  function createVATInvoiceItem(stripeCustomer, plan, country) {
    return stripeUtils.getVATByCountry(country).then(function (VAT) {
      debug('stripe.invoiceItems.create');
      return stripe.invoiceItems.create({
        customer: stripeCustomer.id,
        amount: Math.round(parseInt(plan.amount, 10) * VAT),
        currency: 'gbp',
        description: 'VAT @ ' + (VAT * 100 | 0) + '%',
      });
    });
  }

  new Promise(function (resolve) {
    if (req.body.vat) {
      // check country against the country against the card - it should match
      // if it fails, we swallow and respond
      var country = (req.body.country || '').toUpperCase();
      var vat = (req.body.vat || '').replace(/\s/g, '');
      vatValidator(country, vat, function (error, result) {
        // important: this is where we are swallowing the promise, and not
        // carrying on
        if (error || result.valid === false) {
          metrics.increment('upgrade.fail.vat');
          req.flash(req.flash.ERROR, 'VAT did not appear to be valid, can ' +
            'you try again or follow up with <a ' +
            'href="mailto:support@jsbin.com?subject=Failed VAT">support</a>.');
          // this does NOT return a promise - this is on purpose
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
    // 3. subscribe to plan (and adjust their VAT based on the country of
    //    the card BEFORE THE SUBSCRIPTION)

    /** 1. get a stripe customer id */
    debug('getCustomerByUser');

    // getCustomerByUser will throw if it doesn't find the user - which leads us
    // to creating the new stripe user
    return getCustomerByUser(req.session.user).then(function (results) {
      var result = results[0];
      debug('.then, stripe.customers.retrieve(%s)', result.stripe_id); // jshint ignore:line
      return stripe.customers.update(result.stripe_id, {
        source: stripSubscriptionData.card
      }).catch(function (err) {
        // failed to subscribe existing user to stripe
        metrics.increment('upgrade.fail.existing-user-change-subscription');
        console.error('upgrade.fail.existing-user-change-subscription');
        console.error(err.stack);
      });
    }).catch(function () {
      debug('catch: stripe.customers.create(%s)', JSON.stringify(stripSubscriptionData));
      // create the customer with Stripe since they don't exist
      return stripe.customers.create(stripSubscriptionData).then(function (stripeCustomer) {
        debug('setCustomer & return stripeCustomer');
        return setCustomer({
          stripeId: stripeCustomer.id,
          user: req.session.user.name,
          plan: getPlan(stripeCustomer),
        }).then(function () {
          return stripeCustomer;
        });
      });
    }).then(function (stripeCustomer) {
      // handle VAT item if required
      var country = stripeUtils.getCountry(stripeCustomer);

      debug('Test VAT is required for %s', country);

      // if the card holder is not in the EU, then skip the VAT checking logic
      // and create the subscription
      if (stripeUtils.countryIsInEU(country) === false) {
        return stripeCustomer;
      }

      var plan = getPlan(stripeCustomer);
      var businessVAT = stripeCustomer.metadata.vat;

      debug('stripe.plans.retrieve(%s)', plan, businessVAT);
      return stripe.plans.retrieve(plan).then(function (plan) {
        // note: plan from stripe.plans.retrieve has all the metadata, like
        // the actual price of the plan - which we need to apply the right VAT

        if (businessVAT) {
          debug('business registered');
          return new Promise(function (resolve, reject) {
            vatValidator(country, businessVAT, function (err, result) {
              debug('vatValidator(%s, %s)', country, businessVAT, err, result);
              if (err) {
                return reject(err);
              }

              // if VAT is valid, then there's no VAT applied, and return
              // the customer
              if (result.valid) {
                resolve(stripeCustomer);
              } else {
                // otherwise apply VAT
                resolve(createVATInvoiceItem(stripeCustomer, plan, country));
              }
            });
          });
        } else {
          debug('applying VAT');
          return createVATInvoiceItem(stripeCustomer, plan, country);
        }
      }).then(function () {
        // ensure to end on returning the customer
        return stripeCustomer;
      });
    }).then(function (stripeCustomer) {
      // if the customer already had a subscription, then let's update their
      // subscription to the new one (this is a super edge case as we don't
      // support doing this in the first place)
      if (undefsafe(stripeCustomer, 'subscriptions.data.length')) {
        debug('stripe.customers.updateSubscription');
        return stripe.customers.updateSubscription(
          stripeCustomer.id,
          stripeCustomer.subscriptions.data[0].id,
          { plan: getPlan(stripeCustomer) }
        );
      } else {
        debug('stripe.customers.createSubscription');
        return stripe.customers.createSubscription(
          stripeCustomer.id,
          { plan: getPlan(stripeCustomer) }
        );
      }
    }).then(function (data) {
      debug('setProAccount(%s, true)', req.session.user.name);
      debug(util.inspect(data, { depth: 50 }));
      debug('stripe all done - now setting user to pro!');

      return setProAccount(req.session.user.name, true);
    }).then(function () {
      metrics.increment('upgrade.success');
      req.session.user.pro = true;

      var analytics = 'window.ga && ga("send", "event", "upgrade", "' + req.body.subscription + '"';

      if (req.body.coupon) {
        analytics += ',"coupon", "' + req.body.coupon + '"';
      }

      analytics += ');';

      req.flash(req.flash.NOTIFICATION, 'Welcome to the pro user lounge. Your seat is waiting. In the mean time, <a target="_blank" href="http://jsbin.com/help/pro">find out more about Pro accounts</a><script>' + analytics + '</script>');
      res.redirect('/');
    }).catch(function (error) {
      // there was something wrong with the customer create process, so let's
      // send them back to the payment page with a flash message
      console.log(error.stack);
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
    console.error('uncaught exception in upgrade');
    console.log(error.stack);

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
