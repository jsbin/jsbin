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
    undefsafe = require('undefsafe'),
    options = require('./config');

var teamjsbin = ['rem', 'allouis', 'yandle'];
var alphausers = teamjsbin.concat(['stuartlangridge', 'slexaxton', 'reybango', 'phuu', 'agcolom', 'glennjones', 'rossbruniges', 'andrewnez', 'chrismahon', 'b@brian.io', 'jed', 'iancrowther', 'jakearchibald']);

var flags = {
  /* Begin: user types */
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
  /* End: user types */


  /* Begin: actual features */

  github: function () {
    return options.github && options.github.id;
  },

  // private bins
  private: function (req) {
    return flags.alpha(req); // pro
  },

  // whether user can delete bins
  delete: function (req) {
    return flags.alpha(req);
  },

  // allows for sandbox play in a bin without actually saving
  sandbox: function (req) {
    return flags.alpha(req); // pro
  },

  // info/hover card with details of bin and streaming info
  infocard: function (req) {
    return flags.alpha(req);
  },

  // seperate account management pages
  accountPages: function (req) {
    return false && flags.teamjsbin(req);
  },

  // use SSL for sign in
  sslLogin: function (req) {
    return ['127.0.0.1', '81.174.141.101', '86.10.164.12'].indexOf(req.ip) !== -1;
  },

};

var features = module.exports = new Features(flags);

features.log = function () {
  // console.log.apply(console, [].slice.apply(arguments));
};
