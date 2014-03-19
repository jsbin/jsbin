module.exports = function(app, connection) {
  'use strict';
  var memcached = require('./store')(connection);
  var RSVP = require('rsvp');
  var UserModel = require('../../models').user;
  var undefsafe = require('undefsafe');
  var feature = require('../../features');
  var metrics = require('../../metrics');
  var utils = require('../../utils.js');

  function setMetadata(obj, val) {
    obj.session.user = val;
    obj._userJSONCopy = JSON.stringify(val);
  }

  function populateMemcached(user) {
    return memcached.set(user.name, user);
  }

  function getMetadata(username, req) {
    var setUserMetadata = setMetadata.bind(null, req);

    var promise = new RSVP.Promise(function(resolve, reject){
      // go to database get data about user etc...
      UserModel.load(username, function(err, user) {
        if (err) {
          reject(err);
        } else {
          user.avatar = utils.gravatar(user.email);
          resolve(user);
        }
      });

    })
    .then(populateMemcached)
    .then(setUserMetadata);

    return promise;
  }

  app.use(function(req, res, next) {
    // Stick this all behind a feature flag
    if (!feature('serverSession', req)) {
      return next();
    }

    // Removes user data from old cookies
    var username = undefsafe(req, 'session.user.name');

    var setUserMetadata = setMetadata.bind(null, req);
    var populateUserMetadata = getMetadata.bind(null, username, req);

    // We check for user name to make sure that the session is
    //  a) logged in
    //  b) a cookie to handle users
    if (username) {
      memcached
        .get(username)
        .then(setUserMetadata)
        .catch(populateUserMetadata)
        .then(next);
    } else {
      return next();
    }

    // We're basically yaking the same idea that connects cookieSessions use
    // from here: http://www.senchalabs.org/connect/cookieSession.html
    res.on('header', function () {
      if (req.session.user) {
        if (JSON.stringify(req.session.user) !== req._userJSONCopy) {
          memcached.set(req.session.user.name, req.session.user);
        }
      }
    });
  });

  app.use(function (req, res, next) {
    memcached.items(function (err, result) {
      if (!err) {
        metrics.gauge('sessions.count', result.length);
      }
    });
    next();
  });

};
