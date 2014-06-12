module.exports = function(app, connection) {
  'use strict';
  var memcached = require('./store')(connection);
  var RSVP = require('rsvp');
  var UserModel = require('../../models').user;
  var undefsafe = require('undefsafe');
  var feature = require('../../features');
  var metrics = require('../../metrics');
  var utils = require('../../utils.js');

  // Add memcachedstore to app for other modules to use;
  app.sessionStore = memcached;

  function setMetadata(obj, val) {
    obj.session.user = val;
    obj._userJSONCopy = JSON.stringify(val);
  }

  function populateMemcached(key, user) {
    return memcached.set(key, user);
  }

  function getMetadata(username, req, key, memcachedError) {
    var setUserMetadata = setMetadata.bind(null, req);
    var setMemcachedData = populateMemcached.bind(null, key);

    var promise = new RSVP.Promise(function(resolve, reject){
      // go to database get data about user etc...
      UserModel.load(username, function(err, user) {
        if (err || !user) {
          reject(err);
        } else {
          user.avatar = utils.gravatar(user.email);
          resolve(user);
        }
      });

    });
    if (!memcachedError) {
      promise.then(setMemcachedData);
    }
    promise.then(setUserMetadata);


    return promise;
  }

  app.use(function(req, res, next) {
    // Stick this all behind a feature flag
    if (!feature('serverSession', req)) {
      return next();
    }

    // Removes user data from old cookies
    var username = undefsafe(req, 'session.user.name');
    var key;
    if (username !== undefined) {
      key = username.replace(/\s+/g, '^^');
    }

    var setUserMetadata = setMetadata.bind(null, req);
    var populateUserMetadata = getMetadata.bind(null, username, req, key);

    // We check for user name to make sure that the session is
    //  a) logged in
    //  b) a cookie to handle users
    if (username) {
      memcached
        .get(key)
        .then(setUserMetadata)
        .catch(populateUserMetadata)
        .then(function () {
          // this is required because next was getting the user object and
          // trying to render JSON :-\
          next();
        });
    } else {
      next();
    }

    // We're basically yaking the same idea that connects cookieSessions use
    // from here: http://www.senchalabs.org/connect/cookieSession.html
    res.on('header', function () {
      var oldSessionUser = undefsafe(req, '_sessionBeforeBlacklist.user');
      if (oldSessionUser) {
        // FIXME - this is hacky
        if (JSON.stringify(oldSessionUser) !== req._userJSONCopy) {
          memcached.set(oldSessionUser.name, oldSessionUser);
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
