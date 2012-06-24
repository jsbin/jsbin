var Observable = require('../utils').Observable,
    crypto = require('crypto');

module.exports = Observable.extend({
  constructor: function ForgotTokenModel(store) {
    Observable.call(this);
    this.store = store;
  },
  loadUser: function (token, fn) {
    var _this = this;

    this.store.getUserByForgotToken(token, function (err, user) {
      if (err) {
        return fn(err);
      }

      // Make sure token hasn't expired.
      if (user && user.expires <= new Date()) {
        _this.expireToken(token, function () {});
        fn(null);
      } else {
        fn(null, user);
      }
    });
  },
  createToken: function (user, fn) {
    var token = this.generateToken();
    this.store.setForgotToken(user, token, function (err) {
      if (err) {
        fn(err);
      } else {
        fn(null, token);
      }
    });
  },
  expireToken: function (token, fn) {
    if (typeof token === 'function') {
      fn = token;
      token = null;
    }
    this.store.expireForgotToken(token, fn);
  },
  expireTokensByUser: function (user, fn) {
    this.store.expireForgotTokenByUser(user, fn);
  },
  expireTokens: function (fn) {
    this.expireToken(fn);
  },
  generateToken: function () {
    var rand = '' + (new Date()).getTime();
    return crypto.createHash('md5').update(rand).digest('hex');
  }
});
