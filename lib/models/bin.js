var Observable = require('../utils').Observable,
    metrics = require('../metrics'),
    metric_prefix = 'timer.bin.',
    crypto = require('crypto');

module.exports = Observable.extend({
  constructor: function BinModel(store) {
    Observable.call(this);
    this.store = store;
  },
  load: function (params, fn) {
    var timer = metrics.createTimer(metric_prefix + 'load');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.getBin.call(this.store, params, fn);
  },
  latest: function (params, fn) {
    var timer = metrics.createTimer(metric_prefix + 'latest');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.getLatestBin.call(this.store, params, fn);
  },
  // Create a new bin.
  create: function (data, fn) {
    var timer = metrics.createTimer(metric_prefix + 'create');
    this.store.generateBinId(function (err, id) {
      if (err) {
        return fn(err);
      }

      data.url = id;
      data.revision = 1;
      data.streamingKey = this.createStreamingKey(id, data.revision);
      this.store.setBin(data, function (err, id) {
        timer.stop();
        data.id = id;
        fn(err || null, err ? undefined : data);
      });
    }.bind(this));
  },
  // Create a new revision.
  createRevision: function (data, fn) {
    var timer = metrics.createTimer(metric_prefix + 'createRevision');
    data.streamingKey = this.createStreamingKey(data.url, data.revision);
    this.store.setBin(data, function (err, id) {
      timer.stop();
      data.id = id;
      fn(err || null, err ? undefined : data);
    });
  },
  updatePanel: function (panel, data, fn) {
    var timer = metrics.createTimer(metric_prefix + 'updatePanel');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.setBinPanel.call(this.store, panel, data, fn);
  },
  archive: function (bin, fn) {
    var timer = metrics.createTimer(metric_prefix + 'archive');
    var original = fn;
    fn = function () {
      timer.stop();
      original.apply(this, [].slice.call(arguments));
    };
    this.store.archiveBin.call(this.store, bin, fn);
  },
  createStreamingKey: function (id, rev) {
    var key = "" + id + rev + Math.random();
    return crypto.createHash('md5').update(key).digest('hex');
  },
  report: function (params, fn) {
    this.store.reportBin.apply(this.store, arguments);
  }
});
