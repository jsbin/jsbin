var Observable = require('../utils').Observable,
    bcrypt = require('bcrypt'),
    crypto = require('crypto');

module.exports = Observable.extend({
  constructor: function UserModel(store) {
    Observable.call(this);
    this.store = store;
  },
  load: function (id, fn) {
    this.store.getUser(id, fn);
  },
  loadByEmail: function (email, fn) {
    this.store.getUserByEmail(email, fn);
  },
  create: function (data, fn) {
    var hash = bcrypt.hash.bind(bcrypt, data.key),
        store = this.store;

    this.hash(data.key, function (err, hash) {
      if (err) {
        return fn(err);
      }
      data.key = hash;
      store.setUser(data, fn);
    });
  },
  updateEmail: function (id, email, fn) {
    this.store.updateUserEmail(id, email, fn);
  },
  updateKey: function (id, key, fn) {
    var store = this.store;
    this.hash(key, function (err, hash) {
      if (err) {
        return fn(err);
      }
      store.updateUserKey(id, hash, fn);
    });
  },
  getBins: function (id, fn) {
    this.store.getBinsByUser(id, fn);
  },
  assignBin: function (id, bin, fn) {
    var params = {name: id, url: bin.url, revision: bin.revision};
    this.store.setBinUser(params, fn);
  },
  touchLogin: function (id, fn) {
    this.store.touchLogin(id, fn);
  },
  valid: function (key, encrypted, fn) {
    return bcrypt.compare(key, encrypted, fn);
  },
  hash: function (key, fn) {
    bcrypt.genSalt(function (err, salt) {
      if (err) {
        return fn(err);
      }
      bcrypt.hash(key, salt, fn);
    });
  },
  validOldKey: function (key, encrypted) {
    return encrypted === crypto.createHash('sha1').update(key).digest('hex');
  }
});
