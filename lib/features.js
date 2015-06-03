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

var Features = require('feature-gateway');
var undefsafe = require('undefsafe');
var _ = require('underscore');
var config = require('./config');

var teamjsbin = ['allouis', 'yandle', 'rem'];
var alphausers = teamjsbin.concat(['electric_g', 'sil', 'slexaxton', 'reybango', 'phuu', 'agcolom', 'glennjones', 'rossbruniges', 'andrewnez', 'chrismahon', 'brianleroux', 'jed', 'iancrowther', 'jakearchibald']);

/* Begin: user types */
function alpha(req) {
  var name = undefsafe(req, 'session.user.name');
  if (name) {
    return alphausers.indexOf(name) !== -1;
  }
  return false;
}

function beta(req) {
  return alpha(req) || (pro(req) && undefsafe(req, 'session.user.beta'));
}

function team(req) {
  var name = undefsafe(req, 'session.user.name');
  if (name) {
    return teamjsbin.indexOf(name) !== -1;
  }
  return false;
}

function pro(req) {
  return undefsafe(req, 'session.user.pro');
}

/* End: user types */

function ipAsNum(req) {
  // takes the last part of an IP (n.n.n.last-part) and returns as number
  return (req.headers['x-real-ip'] || req.ip || '0.0').split('.').slice(-1) * 1;
}

function percentage(n, req) {
  var ip = ipAsNum(req);
  return (ip / 256) <= (n / 100);
}

function isCanary(req) {
  var ua = req.headers['user-agent'];
  if (ua.indexOf('Chrome/38') !== -1)
    return true;
  return false;
}



var flags = {
  /* Begin: actual features */
  admin: team,

  pro: pro,

  github: function () {
    return config.github && config.github.id;
  },

  // private bins
  private: pro, // live June 16, 2014-05-27

  // whether user can delete bins
  delete: true, // live 25 Feb 2014

  // allows for sandbox play in a bin without actually saving
  sandbox: pro, // live June 16, 2014-05-27

  // info/hover card with details of bin and streaming info
  infocard: true, // live July 13, 2014

  // seperate account management pages
  accountPages: true, // live 2014-05-27

  // use SSL for sign in
  sslLogin: true,

  // using memcache for sessions
  serverSession: true,

  intercom: function () {
    return !!undefsafe(config, 'features.intercom');
  },

  // new upgrade page with login & reg side-by-side with feature grid
  upgradeWithFeatures: function (req) {
    return true; //percentage(75, req);
    // put live 2014-08-15 due to emergency fix, 25% getting 404
  },

  vanity: pro, // live June 16, 2014-05-27

  dropbox: pro, // live June 20, 2014

  processors: true, // live July 11, 2014 - for Sass - Remy made me do it!

  // s3 based asset hosting
  assets: pro, // live Feb 04, 2015

  // allow users to set metadata about a bin
  metadata: function (req) {
    return beta(req);
  },

  revisionless: function (req) {
    return alpha(req);
  },

  sendy: function () {
    return !!undefsafe(config, 'mail.sendy.key');
  },

  // allows the user to use jsbin entirely through SSL
  sslForAll: function (req) { // live July 13, 2014
    var sslForBin = pro({ session: { user: undefsafe(req, 'bin.metadata') }});
    return (pro(req) && undefsafe(req, 'session.user.settings.ssl')) || sslForBin;
  },

  fileMenuTest: true, // live 2014-05-27 - #1414

  upgrade: true, // live July 23, 2014

  // allows user to pre-configure the layout of the panels
  layouts: beta,

  // top introduction view with help and features of JS Bin
  welcomePanel: true, // live July 23, 2014
};

if (config.featureFlags) {
  _.extend(flags, config.featureFlags);
}

var features = module.exports = new Features(flags);

features.log = function () {
  // console.log.apply(console, [].slice.apply(arguments));
};
