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
    console.log('model.load', this);
    this.store.getBin(params, fn);
  },
  latest: function (params, fn) {
    this.store.getLatestBin(params, function (err, bin) {
      if (err) {
        return fn(err, null);
      }

      this.getBinMetadata(bin, function (err, metadata) {
        bin.metadata = metadata;

         // this should only let users see the latest
         // "active", and visible bin to that user

/*
  protectVisibility: function (user, bin, cb) {
    if (bin.active === 'y') {
      if (!bin.metadata) { // bin does not exist yet, it cannot be private
        return cb(null, bin);
      }
      if (bin.metadata.visibility === 'public') {
        return cb(null, bin);
      }
      if (user && bin.metadata.name === user.name) {
        return cb(null, bin);
      }
    }

    this.loadFiles(this.defaultFiles(), function(err, files) {
      bin.javascript = files.javascript;
      bin.html = files.html;
      bin.css = files.css;
      cb(err, bin);
    });
  },

 */

        fn(null, bin);
      });

    }.bind(this));
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
