'use strict';
var semver = require('semver');
var undefsafe = require('undefsafe');

function version(v1) {
  return {
    gt: function (v2) {
      return semver.gt(v1, v2);
    },
    gte: function (v2) {
      return semver.gte(v1, v2);
    },
    lt: function (v2) {
      return semver.lt(v1, v2);
    },
    lte: function (v2) {
      return semver.lte(v1, v2);
    },
    eq: function (v2) {
      return semver.eq(v1, v2);
    },
    toString: function () {
      return v1 + '';
    }
  };
}

module.exports = function (req) {
  var sessionVersion = undefsafe(req, 'session.version');
  if (sessionVersion) {
    return version(sessionVersion);
  } else {
    return version('0.0.0');
  }
};