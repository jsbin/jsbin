var Observable = require('../utils').Observable,
    metrics = require('../metrics'),
    metric_prefix = 'timer.user.',
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
  getOne: function (queryKey, params, fn) {
    this.store.getOne(queryKey, params, fn);
  },
  loadByApiKey: function (apiKey, fn) {
    this.store.getUserByApiKey(apiKey, fn);
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
  getBinCount: function (id, fn) {
    this.store.getUserBinCount(id, fn);
  },
  updateGithubData: function (id, ghId, token, fn) {
    this.store.updateUserGithubData(id, ghId, token, fn);
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
  getLatestBin: function (id, n, fn) {
    var timer = metrics.createTimer(metric_prefix + 'getLatestBin');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    n = Math.abs(parseInt(n)) || 0;
    this.store.getLatestBinForUser(id, n, fn);
  },
  getBins: function (id, fn) {
    var timer = metrics.createTimer(metric_prefix + 'getBins');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.getBinsByUser(id, fn);
  },
  isOwnerOf: function (username, bin, fn) {
    var params = {
      name: username,
      url: bin.url,
      revision: bin.revision
    };
    this.store.isOwnerOf(params, fn);
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
    var timer = metrics.createTimer(metric_prefix + 'setBinOwner');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.setBinOwner(params, fn);
  },
  touchLogin: function (id, fn) {
    var timer = metrics.createTimer(metric_prefix + 'touchLogin');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.touchLogin(id, fn);
  },
  touchOwners: function (id, bin, fn) {
    var params = {
      name: id,
      url: bin.url,
      revision: bin.revision
    };
    var timer = metrics.createTimer(metric_prefix + 'touchOwners');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
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
    var timer = metrics.createTimer(metric_prefix + 'updateOwners');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
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
