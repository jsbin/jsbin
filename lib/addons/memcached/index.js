module.exports = function (app, connection) {
  'use strict';
  var memcached = require('./store')(connection);
  var UserModel = require('../../models').user;
  var undefsafe = require('undefsafe');
  var feature = require('../../features');
  var metrics = require('../../metrics');
  var utils = require('../../utils.js');

  // add memcachedstore to app for other modules to use;
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

    var promise = new Promise(function (resolve, reject) {
      // go to database get data about user etc...
      UserModel.load(username, function (err, user) {
        if (err || !user) {
          reject(err);
        } else {
          user.avatar = req.app.locals.gravatar(user);
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

  app.use(function (req, res, next) {
    // stick this all behind a feature flag
    if (!feature('serverSession', req)) {
      return next();
    }

    // removes user data from old cookies
    var username = undefsafe(req, 'session.user.name');
    var key;
    if (username !== undefined) {
      key = username.replace(/\s+/g, '^^');
    }

    var setUserMetadata = setMetadata.bind(null, req);
    var populateUserMetadata = getMetadata.bind(null, username, req, key);

    // we check for user name to make sure that the session is
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

    // we're basically yaking the same idea that connects cookieSessions use
    // from here: http://www.senchalabs.org/connect/cookieSession.html
    res.on('header', function () {
      var sessionUser = undefsafe(req, '_sessionBeforeBlacklist.user');
      // if there's no user on the session, there's nothing to save
      if (!sessionUser) {
        return;
      }
      // if we have a copy of the user on the "way in" and it's the
      // same as the user on the session now, there's no need to save
      if (req._userJSONCopy) {
        // note: this is hacky (use a compare/equals function?)
        if (JSON.stringify(sessionUser) === req._userJSONCopy) {
          return;
        }
      }
      // for everything else, we save them to memcache
      memcached.set(sessionUser.name, sessionUser);
    });
  });

  app.use(function (req, res, next) {
    memcached.items().then(function (results) {
      metrics.gauge('sessions.count', results.length);
      next();
    }, function () {
      next();
    });
  });

};
