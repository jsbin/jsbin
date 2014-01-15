var Memcached = require('memcached'),
    PseudoMemcached = require('./PseudoMemcached');

module.exports = function (options) {
  'use strict'; 
  var memcache;

  if (options.memcache && options.memcache.connection) {
    memcache = new Memcached(options.memcache.connection);
  } else {
    memcache = new PseudoMemcached();
  }


   
};
