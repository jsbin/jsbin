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

var teamjsbin = ['rem', 'allouis', 'yandle', 'electric_g'];
var alphausers = teamjsbin.concat(['stuartlangridge', 'slexaxton', 'reybango', 'phuu', 'agcolom', 'glennjones', 'rossbruniges', 'andrewnez', 'chrismahon', 'brianleroux', 'jed', 'iancrowther', 'jakearchibald']);

/* Begin: user types */
function alpha(req) {
  var name = undefsafe(req, 'session.user.name');
  if (name) {
    return alphausers.indexOf(name) !== -1;
  }
  return false;
}

function beta(req) {
  return undefsafe(req, 'session.user.beta');
}

function team(req) {
  var name = undefsafe(req, 'session.user.name');
  if (name) {
    return teamjsbin.indexOf(name) !== -1;
  }
  return false;
}

function pro(req) {
  return flags.alpha(req) || undefsafe(req, 'session.user.pro');
}
/* End: user types */


var flags = {
  /* Begin: actual features */

  github: function () {
    return options.github && options.github.id;
  },

  // private bins
  private: function (req) {
    return alpha(req); // pro
  },

  // whether user can delete bins
  delete: true, // live 25 Feb 2014

  // allows for sandbox play in a bin without actually saving
  sandbox: function (req) {
    return alpha(req); // pro
  },

  // info/hover card with details of bin and streaming info
  infocard: function (req) {
    return alpha(req);
  },

  // seperate account management pages
  accountPages: function (req) {
    return alpha(req);
  },

  // use SSL for sign in
  sslLogin: true,

  // using memcache for sessions
  serverSession: true,

  // code-analysis engine for javascript panel
  tern: function (req) {
    return alpha(req);
  },

  stripe: function (req) {
    return team(req);
  },

  dropbox: function (req) {
    return alpha(req);
  }

};

var features = module.exports = new Features(flags);

features.log = function () {
  // console.log.apply(console, [].slice.apply(arguments));
};
