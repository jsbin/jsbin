'use strict';
var app = require('../app.js');
var memcached = require('./memcached-store');
var RSVP = require('rsvp');
var UserModel = require('../models/user');

function setMetadata (obj, val) {
  console.log('setUserMetadata', val);
  obj.user = val;
}

function populateMemcached(obj) {
  console.log('populateMemcached', obj);
  return memcached.set(obj.name, obj);
}

function getMetadata(username, req) {
  var setUserMetadata = setMetadata.bind(null, req);
  var promise = new RSVP.Promise(function(resolve, reject){
    // go to database get data about user etc...
    UserModel.load(username, function(err, val) {
      if (err) {
        reject(err);
      } else {
        resolve(val);
      }
    });

  })
  .then(populateMemcached)
  .then(setUserMetadata);
  return promise;
}


app.use(function(req, res, next) {
  // Removes user data from old cookies
  var username;
  if (req.session.user && req.session.user.email) {
    username = req.session.user.name;
    req.session.user = {
      name: username
    };
  }
  console.log('username', username);

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
  
});
