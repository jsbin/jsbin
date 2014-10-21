'use strict';
var Observable = require('../utils').Observable;

var model = {
  constructor: function AssetModel(store) {
    Observable.call(this);
    this.store = store;
  },
  getAssetsForUser: function (username, fn) {
    return this.store.getAssetsForUser(username, fn);
  },
  saveAsset: function (opts, fn) {
    return this.store.saveAsset(opts, fn);
  },
  deleteAsset: function (opts, fn) {
    return this.store.deleteAsset(opts, fn);
  }
};

module.exports = Observable.extend(model);
