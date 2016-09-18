'use strict';
var emailSender = require('../email');
var Observable = require('../utils').Observable;
var metrics = require('../metrics');
var metricPrefix = 'timer.user.';
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

module.exports = Observable.extend({
  constructor: function UserModel(store) {
    Observable.call(this);
    this.store = store;
  },
  applySettings: function (fn) {
    return function (err, user) {
      if (user) {
        if (user.settings === null) {
          user.settings = {};
        } else if (user && user.settings && typeof user.settings === 'string') {
          try {
            user.settings = JSON.parse(user.settings) || {};
          } catch (e) {
            user.settings = {};
          }
        }

        if (user && user.embed && typeof user.embed === 'string') {
          try {
            user.embed = JSON.parse(user.embed) || {};
          } catch (e) {
            user.embed = {};
          }
        }
      }
      fn(err, user);
    };
  },
  load: function (id, fn) {
    this.store.getUser(id, this.applySettings(fn));
  },
  getOne: function (queryKey, params, fn) {
    this.store.getOne(queryKey, params, this.applySettings(fn));
  },
  loadByApiKey: function (apiKey, fn) {
    this.store.getUserByApiKey(apiKey, this.applySettings(fn));
  },
  loadByEmail: function (email, fn) {
    this.store.getUserByEmail(email, this.applySettings(fn));
  },
  create: function (data, fn) {
    var store = this.store;

    this.hash(data.key, function (err, hash) {
      if (err) {
        return fn(err);
      }
      data.key = hash;

      if (data.email) {
        emailSender.send({
          filename: 'welcome',
          data: { user: {
            name: data.name,
            email: data.email,
          }, },
          to: data.email,
          subject: 'Welcome!',
        }).catch(function (e) {
          console.log('welcome email failed');
          console.log(e.stack);
        });
      }


      store.setUser(data, this.applySettings(fn));
    }.bind(this));
  },
  updateEmail: function (id, email, fn) {
    this.store.updateUserEmail(id, email, fn);
  },
  generateAPIKey: function (id, fn) {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var hash = crypto.createHash('sha1').update(current_date + random + id.trim()).digest('hex');

    this.updateOwnershipData(id, {
      api_key: hash
    }, function (error) {
      fn(error, hash);
    });
  },
  getBinCount: function (id, fn) {
    this.store.getUserBinCount(id, fn);
  },
  updateGithubData: function (id, ghId, token, fn) {
    this.store.updateUserGithubData(id, ghId, token, fn);
  },
  updateDropboxData: function (id, token, fn) {
    this.store.updateUserDropboxData(id, token, fn);
  },
  setProAccount: function(id, val, fn){
    this.store.setProAccount(id, val, fn);
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
  updateSettings: function (id, settings, fn) {
    this.store.updateUserSettings(id, settings, fn);
  },
  // FIXME !! This logic should be moved into bin model!!!!
  getLatestBin: function (id, n, username, fn) {
    var timer = metrics.createTimer(metricPrefix + 'getLatestBin');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    n = Math.abs(parseInt(n)) || 0;
    this.store.getLatestBinForUser(id, n, function(err, bin) {
      if (bin === null) {
        return fn(404);
      }

      this.store.getBinMetadata(bin, function(err, metadata) {
        if (err) {
          return fn(err);
        }

        bin.metadata = metadata;

        if (this.isVisible(bin, username)) {
          fn(null, bin);
        } else {
          fn(401);
        }

      }.bind(this));

    }.bind(this));

  },
  // FIXME !! Duplicate logic between this and bin handler
  isVisible: function (bin, username) {
    if (!username) {
      username = '';
    }

    if (typeof username !== 'string') {
      throw new Error('isVisible requires name to be string');
    }

    // This will only occur if it isn't a real bin, it has been created
    // on from default files and does not exist in any database. By this
    // logic the bin must be public, it has no owner and no record.
    if (!bin || !bin.metadata) {
      return true;
    }
    // this should only let users see the latest
    // "active", and visible bin to that user
    if (bin && bin.active === 'y') {
      if (bin.metadata.visibility === 'public') {
        return true;
      }
      if (username && bin.metadata.name === username) {
        return true;
      }
    }

    return false;
  },
  getBins: function (id, fn) {
    var timer = metrics.createTimer(metricPrefix + 'getBins');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.getBinsByUser(id, fn);
  },
  getUserListing: function (id, fn) { // aka getDetailedBins (sandbox.settings for title + desc)
    var timer = metrics.createTimer(metricPrefix + 'getUserListing');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.getUserListing(id, fn);
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
      javascript: !!bin.javascript,
      visibility: bin.visibility
    };
    var timer = metrics.createTimer(metricPrefix + 'setBinOwner');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.setBinOwner(params, fn);
  },
  touchLogin: function (id, fn) {
    var timer = metrics.createTimer(metricPrefix + 'touchLogin');
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
    var timer = metrics.createTimer(metricPrefix + 'touchOwners');
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
      panel_open: bin.panel_open // jshint ignore:line
    };
    var timer = metrics.createTimer(metricPrefix + 'updateOwners'); //
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.updateOwners(params, fn);
  },
  saveBookmark: function (user, bin, type, fn) {
    var params = {
      name: user.name,
      url: bin.url,
      revision: bin.revision,
      type: type
    };
    this.store.saveBookmark(params, fn);
  },
  getBookmark: function (user, type, fn) {
    var params = {
      name: user.name,
      type: type
    };
    this.store.getBookmark(params, fn);
  },
  valid: function (key, encrypted, fn) {
    return bcrypt.compare(key, encrypted, fn);
  },
  hash: function (key, fn) {
    bcrypt.genSalt(null, function (err, salt) {
      if (err) {
        return fn(err);
      }
      bcrypt.hash(key, salt, null, fn);
    });
  },
  validOldKey: function (key, encrypted, fn) {
    fn(null, encrypted === crypto.createHash('sha1').update(key).digest('hex'));
  },
  delete: function (id, fn) {
    this.store.deleteUser(id, fn);
  },
  updateOwnershipData: function (username, params, fn) { // "user_profile" table
    this.store.updateOwnershipData([username], params, fn);
  },
});
