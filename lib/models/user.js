var bcrypt = require('bcrypt');

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
    }
  };
};
