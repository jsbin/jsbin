'use strict';
var Observable = require('../utils').Observable,
    metrics = require('../metrics'),
    metricPrefix = 'timer.bin.',
    moment = require('moment'),
    crypto = require('crypto'),
    dropbox = require('../dropbox'),
    processors = require('../processors'),
    blacklist = require('../blacklist'),
    undefsafe = require('undefsafe'),
    createFileFromBin = require('bin-to-file');

var binPanels = ['html', 'css', 'javascript'];

var model = {
  constructor: function BinModel(store) {
    Observable.call(this);
    this.store = store;
  },
  load: function (req, params, fn) {
    this.store.getBin(params, this.binLoadCallback(req, params, fn));
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

    console.log(bin);

    if (bin.active === 'n' && bin.reported && bin.sourceOnly) {
      return true;
    }

    return false;
  },
  latest: function (req, params, fn) {
    this.store.getLatestBin(params, this.binLoadCallback(req, params, fn));
  },
  binLoadCallback: function (req, params, fn) {
    return function (err, bin) {
      if (err || !bin) {
        return fn(err, null);
      }

      if (!req.sourceOnly && bin.active === 'n' && bin.reported) {
        return fn(423);
      }

      this.getBinMetadata(bin, function loadedGetMetadata(err, metadata) {
        bin.metadata = metadata;

        // if the content is blacklisted AND the user is NOT verified,
        // then return a 410
        if (!undefsafe(bin, 'metadata.verified') &&
            blacklist.validate(bin) === false) {
          return fn(410);
        }

        if (req.sourceOnly) {
          bin.sourceOnly = req.sourceOnly;
        }

        if (typeof bin.metadata.settings === 'string') {
          try {
            bin.metadata.settings = JSON.parse(bin.metadata.settings);
          } catch (e) {}
        }

        if (this.isVisible(bin, params.username)) {
          fn(null, bin);
        } else {
          // don't give the bin back
          fn(401);
        }
      }.bind(this));
    }.bind(this);

  },
  // Create a new bin.
  create: function (data, fn) {
    this.store.generateBinId(data.length, 0, function generateBinId(err, id) {
      if (err) {
        return fn(err);
      }

      data.url = id;
      data.revision = 1;
      data.latest = true;
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
  saveToDropbox: function (bin, token) {
    //if (user.dropbox_token &&
    if(this.dropboxBin(bin)) { // jshint ignore:line
      dropbox.saveBin(this.fileFromBin(bin), this.fileNameFromBin(bin), token);
    }
  },
  dropboxBin: function (bin) {
    // should return true/false based on whether the bin should be saved to dropbox
    // e.g look for a dropboxEnabled value, or a metadata.pro val
    return !!bin;
  },
  fileNameFromBin: function(bin) {
    return bin.url + '.html';
  },
  fileFromBin: function (bin) {
    // console.log(bin);
    // PrePro is short for preprocessors
    var binPrePro = JSON.parse(bin.settings || '{}').processors || {};

    var binObject = {
      revision: bin.revision,
      url: bin.url,
      html: bin.html,
      css: bin.css,
      javascript: bin.javascript,
      source: {
        html: bin.original_html || bin.html,
        css: bin.original_css || bin.css,
        javascript: bin.original_javascript || bin.javascript
      },
      processors: binPrePro
    };

    return createFileFromBin(binObject);
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
  updateBinData: function (bin, params, fn) {
    this.store.updateBinData([bin.url, bin.revision], params, fn);
  },
  updateOwnersData: function (bin, params, fn) {
    this.store.updateOwnersData([bin.url, bin.revision], params, fn);
  },
  isStreaming: function (bin) {
    // if it was changed in the last 20 minutes, then it's streaming
    return bin.streaming_key ? moment(bin.created).isAfter(moment().subtract(20, 'm')) : false;
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
    return method.apply(this, args);
  };
});

module.exports = Observable.extend(model);
