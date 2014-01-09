'use strict';

var Features = require('feature-gateway'),
    undefsafe = require('undefsafe');

var teamjsbin = ['rem', 'allouis', 'yandle'];
var alphausers = teamjsbin.concat([]);

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

  pro: function (req) {
    return undefsafe(req, 'session.user.pro');
  },

  teamjsbin: function (req) {
    var name = undefsafe(req, 'session.user.name');
    if (name) {
      return teamjsbin.indexOf(name) !== -1;
    }
    return false;
  }
};

module.exports = new Features(flags);