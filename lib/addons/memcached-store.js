'use strict';
var Memcached = require('memcached'),
    Promise = require('rsvp').Promise;

var memcachedstore = new Memcached('localhost:11211');

module.exports = {

  get: function(id){
    return new Promise(function(resolve, reject) {
      memcachedstore.get(id, function(err, val) {
        if (err || val === false) {
          reject(err);
        } else {
          resolve(val);
        }
      });
    });
  },

  set: function(id, val, lifetime) {
    lifetime = lifetime || 600000;
    console.log(id);
    console.log(val);
    return new Promise(function(resolve, reject) {
      memcachedstore.set(id, val, lifetime, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(val);
        }
      });
    });
  }

};
