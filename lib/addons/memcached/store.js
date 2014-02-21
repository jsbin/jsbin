'use strict';
var Memcached = require('memcached'),
    replify = require('replify'),
    Promise = require('rsvp').Promise;


module.exports = function(connection) {

  var memcachedstore = new Memcached(connection);

  var API = {

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

  replify('memcache', API);

  return API;

};
