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
  updateKey: function (id, key, fn, upgrade) {
    var store = this.store;
    this.hash(key, function (err, hash) {
      if (err) {
        return fn(err);
      }

      // We're upgrading an old account.
      if (upgrade === true) {
        store.upgradeUserKey(id, hash, fn);
      } else {
        store.updateUserKey(id, hash, fn);
      }
    });
  },
  // Upgrades the user from a JSBin 2 account.
  upgradeKey: function (id, key, fn) {
    this.updateKey(id, key, fn, true);
  },
  getLatestBin: function (id, fn) {
    this.store.getLatestBinForUser(id, fn);
  },
  getBins: function (id, fn) {
    this.store.getBinsByUser(id, fn);
  },
  setBinOwner: function (id, bin, fn) {
    var params = {
      name: id,
      url: bin.url,
      revision: bin.revision,
      summary: bin.summary,
      html: !!bin.html,
      css: !!bin.css,
      javascript: !!bin.javascript
    };
    this.store.setBinOwner(params, fn);
  },
  touchLogin: function (id, fn) {
    this.store.touchLogin(id, fn);
  },
  touchOwners: function (id, bin, fn) {
    var params = {
      name: id,
      url: bin.url,
      revision: bin.revision
    };
    this.store.touchOwners(params, fn);
  },
  updateOwners: function (id, bin, fn) {
    var params = {
      name: id,
      url: bin.url,
      revision: bin.revision,
      summary: bin.summary,
      panel: bin.panel,
      panel_open: bin.panel_open
    };
    this.store.updateOwners(params, fn);
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
