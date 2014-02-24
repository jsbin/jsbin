'use strict';
var Observable = require('../utils').Observable,
    metrics = require('../metrics'),
    metricPrefix = 'timer.bin.',
    crypto = require('crypto');

var model = {
  constructor: function BinModel(store) {
    Observable.call(this);
    this.store = store;
  },
  load: function (params, fn) {
    this.store.getBin(params, function loadedGetBin(err, bin) {
      if (err || !bin) {
        return fn(err);
      }

      this.getBinMetadata(bin, function loadBinMetadata(err, metadata) {
        if (err) {
          return fn(err);
        }

        bin.metadata = metadata;

        if (this.isVisible(bin, params.username)) {
          fn(null, bin);
        } else {
          fn(401);
        }
      }.bind(this));
    }.bind(this));
  },
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
  latest: function (params, fn) {
    this.store.getLatestBin(params, function loadedGetLatestBin(err, bin) {
      if (err || !bin) {
        return fn(err, null);
      }

      this.getBinMetadata(bin, function loadedGetMetadata(err, metadata) {
        bin.metadata = metadata;

        if (this.isVisible(bin, params.username)) {
          fn(null, bin);
        } else {
          // don't give the bin back
          fn(401);
        }
      }.bind(this));

    }.bind(this));
  },
  // Create a new bin.
  create: function (data, fn) {
    this.store.generateBinId(data.length, 0, function generateBinId(err, id) {
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
  // Create a new revision.
  createRevision: function (data, fn) {
    data.streamingKey = this.createStreamingKey(data.url, data.revision);
    this.store.setBin(data, function (err, id) {
      data.id = id;
      fn(err || null, err ? undefined : data);
    });
  },
  updatePanel: function (panel, data, fn) {
    this.store.setBinPanel(panel, data, fn);
  },
  archive: function (bin, fn) {
    this.store.archiveBin(bin, fn);
  },
  createStreamingKey: function (id, rev) {
    var key = '' + id + rev + Math.random();
    return crypto.createHash('md5').update(key).digest('hex');
  },
  report: function (params, fn) {
    this.store.reportBin(params, fn);
  },
  getBinMetadata: function(bin, fn) {
    this.store.getBinMetadata(bin, fn);
  },
  setBinVisibility: function(bin, name, value, fn) {
    this.store.setBinVisibility(bin, name, value, fn);
  },
  updateBin: function (bin, field, value, fn) {
    this.store.updateBin(bin, field, value, fn);
  }
};

// hook up timers
Object.keys(model).forEach(function (key) {
  var method = model[key];

  // check the signature of the function
  if (!method.toString().match(/function.*fn\)/)) {
    return;
  }

  model[key] = function metricsWrapper() { // assume callback is last
    var timer = metrics.createTimer(metricPrefix + key),
        args =  [].slice.apply(arguments),
        original = args.pop();

    var fn = function metricsEndWrapper() {
      timer.stop();
      original.apply(this, arguments);
    };

    args.push(fn);
    method.apply(this, args);
  };
});

module.exports = Observable.extend(model);
