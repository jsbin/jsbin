/**
 * usage:
 *
 * var features = require('./features');
 *
 * if (features('alpha', req)) {
 *   // do alpha features
 * }
 *
 * // as an express route handler - if it fails the feature test then
 * // the user will see a 404 (in this case, you can catch /cool-feature, and
 * // express will call the second handler)
 * app.get('/cool-feature', features.route('alpha'), function (req, res) {
 *   res.render('cool-feature');
 * });
 *
 * // as a hbs template (defined in ./hbs.js)
 * {{#feature user "alpha"}}You are part of the cool gang{{/feature}}
 */
'use strict';

var Features = require('feature-gateway'),
    undefsafe = require('undefsafe');

var teamjsbin = ['rem', 'allouis', 'yandle'];
var alphausers = teamjsbin.concat(['stuartlangridge', 'slexaxton', 'reybango', 'phuu', 'agcolom']);

var flags = {

  alpha: function (req) {
    var name = undefsafe(req, 'session.user.name');
    if (name) {
      return alphausers.indexOf(name) !== -1;
    }
    return false;
  },

  beta: function (req) {
    return undefsafe(req, 'session.user.beta');
  },

  teamjsbin: function (req) {
    var name = undefsafe(req, 'session.user.name');
    if (name) {
      return teamjsbin.indexOf(name) !== -1;
    }
    return false;
  },

  pro: function (req) {
    return flags.alpha(req) || undefsafe(req, 'session.user.pro');
  },

  delete: function (req) {
    return flags.alpha(req);
  }
};

var features = module.exports = new Features(flags);

features.log = function () {
  // console.log.apply(console, [].slice.apply(arguments));
};