'use strict';
var net = require('net');
var Memcached = require('memcached');
var replify = require('replify');

var testForMemcachedServer = function (connection) {
  return new Promise(function (resolve, reject) {
    (new net.Socket())
      .connect(connection.split(':')[1])
      .on('error', function () {
        this.destroy();
        reject(new Error('Could not connect to memcached'));
      }).on('connect', function () {
        this.destroy();
        resolve();
      });
  });
};

module.exports = function(connection) {
  var memcachedstore = null;

  testForMemcachedServer(connection).then(function () {
    memcachedstore = new Memcached(connection);
  }).catch(function (error) {
    console.error(error.stack);
  });

  var API = {
    get: function (id){
      return new Promise(function(resolve, reject) {
        if (!memcachedstore) {
          return reject(new Error('not connected to memcached'));
        }

        memcachedstore.get(id, function(err, val) {
          if (err || val === false) {
            reject(err);
          } else {
            resolve(val);
          }
        });
      });
    },

    clear: function (id, fn) {
      this.set(id, false, 0, fn || function () {});
    },

    set: function (id, val, lifetime) {
      lifetime = lifetime || 7 * 24 * 60 * 60;
      return new Promise(function(resolve, reject) {
        if (!memcachedstore) {
          return reject(new Error('not connected to memcached'));
        }

        memcachedstore.set(id, val, lifetime, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(val);
          }
        });
      });
    },

    items: function () {
      return new Promise(function (resolve, reject) {
        if (memcachedstore) {
          memcachedstore.items(function (err, results) {
            if (err) {
              return reject(err);
            }
            resolve(results);
          });
        } else {
          reject('memcached is not connected');
        }
      });
    },

  };

  replify('memcache', API);

  return API;

};
