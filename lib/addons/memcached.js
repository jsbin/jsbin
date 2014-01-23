'use strict';
var app = require('../app.js');
var memcached = require('./memcached-store');
var RSVP = require('rsvp');
var UserModel = require('../models/user');
var undefsafe = require('undefsafe');

function setMetadata(obj, val) {
  console.log('setUserMetadata', val);
  obj.session.user = val;
  obj._userJSONCopy = JSON.stringify(val);
}

function populateMemcached(user) {
  console.log('populateMemcached', user);
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
        resolve(user);
      }
    });

  })
  .then(populateMemcached)
  .then(setUserMetadata);

  return promise;
}


app.use(function(req, res, next) {
  // Removes user data from old cookies
  var username = undefsafe(req, 'session.user.name');

  var setUserMetadata = setMetadata.bind(null, req);
  var populateUserMetadata = getMetadata.bind(null, username, req);

  if (username) {
    memcached
      .get(username)
      .then(setUserMetadata)
      .catch(populateUserMetadata)
      .then(next);
  } else {
    next();
  }

  res.on('header', function () {
    if (req.session.user) {
      if (JSON.stringify(req.session.user) !== req._userJSONCopy) {
        memcached.set(req.session.user.name, req.session.user);
      }
    }
  });
});