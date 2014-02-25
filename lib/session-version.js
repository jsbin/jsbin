'use strict';
var semver = require('semver');
var undefsafe = require('undefsafe');

module.exports = function version(req) {
  var sessionVersion = undefsafe(req, 'session.version');
  if (sessionVersion) {
    return semver.bind(semver, sessionVersion);
  } else {
    // TODO bind res on headers to add the version
    return semver.bind(semver, '0.0.0');
  }
};