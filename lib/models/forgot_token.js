var Observable = require('../utils').Observable,
    crypto = require('crypto');

module.exports = Observable.extend({
  constructor: function ForgotTokenModel(store) {
    Observable.call(this);
    this.store = store;
  },
  getUser: function (token, fn) {
    this.store.getUserByForgotToken(token, fn);
  },
  createToken: function (user, fn) {
    var token = this.generateToken();
    this.store.setForgotToken(user, token, fn);
  },
  expireToken: function (token, fn) {
    if (typeof token === 'function') {
      fn = token;
      token = null;
    }
    this.store.getUserByForgotToken(token, fn);
  },
  expireTokens: function (fn) {
    this.expireToken(fn);
  },
  generateToken: function () {
    var rand = new Date().getTime();
    return crypto.createHash('md5').update(rand).digest('hex');
  }
});
