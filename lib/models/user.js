var bcrypt = require('bcrypt'),
    crypto = require('crypto');

module.exports.create = function (store) {
  return {
    load: function (id, fn) {
      store.getUser(id, fn);
    },
    create: function (data, fn) {
      var hash = bcrypt.hash.bind(bcrypt, data.key);
      this.hash(data.key, function (err, hash) {
        if (err) {
          return fn(err);
        }
        data.key = hash;
        store.setUser(data, fn);
      });
    },
    updateKey: function (id, key, fn) {
      this.hash(key, function (err, hash) {
        if (err) {
          return fn(err);
        }
        store.updateUserKey(id, hash, fn);
      });
    },
    assignBin: function (id, bin, fn) {
      var params = {name: id, url: bin.url, revision: bin.revision};
      store.setBinUser(params, fn);
    },
    touchLogin: function (id, fn) {
      store.touchLogin(id, fn);
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
  };
};
