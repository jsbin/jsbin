  'use strict';
function PseudoMemcached() {
  this._store = {};
}

PseudoMemcached.prototype = {

  set: function (key, val, lifetime, cb) {
    this._store[key] = val;     
    if (this._timers[key]) {
      clearTimeout(this._timers[key]);
    }
    setTimeout(function(){
      delete this._store[key];
    }.bind(this), lifetime*1000);
    cb(null); 
  },

  get: function(key, cb) {
    if (this._store[key] !== undefined) {
      cb(null, this._store[key]);
    } else {
      cb(new Error('key not found'), null);
    }     
  }

};
