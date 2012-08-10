var Observable = require('../utils').Observable,
    crypto = require('crypto');

module.exports = Observable.extend({
  constructor: function BinModel(store) {
    Observable.call(this);
    this.store = store;
  },
  load: function (params, fn) {
    this.store.getBin.apply(this.store, arguments);
  },
  latest: function (params, fn) {
    this.store.getLatestBin.apply(this.store, arguments);
  },
  // Create a new bin.
  create: function (data, fn) {
    this.store.generateBinId(function (err, id) {
      if (err) {
        return fn(err);
      }

      data.url = id;
      data.revision = 1;
      data.streamingKey = this.createStreamingKey(id, data.revision);

      this.store.setBin(data, function (err, id) {
        data.id = id;
        fn(err || null, err ? undefined : data);
      });
    }.bind(this));
  },
  createRevision: function (data, fn) {
    data.streamingKey = this.createStreamingKey(data.url, data.revision);
    this.store.setBin(data, function (err, id) {
      data.id = id;
      fn(err || null, err ? undefined : data);
    });
  },
  // Create a new revision.
  updatePanel: function (panel, data, fn) {
    this.store.setBinPanel.apply(this.store, arguments);
  },
  createStreamingKey: function (id, rev) {
    var key = "" + id + rev + Math.random();
    return crypto.createHash('md5').update(key).digest('hex');
  },
  report: function (params, fn) {
    this.store.reportBin.apply(this.store, arguments);
  }
});
