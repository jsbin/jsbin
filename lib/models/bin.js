var crypto = require('crypto');

module.exports.create = function (store) {
  var bin = {
    load: function (params, fn) {
      store.getBin.apply(store, arguments);
    },
    latest: function (params, fn) {
      store.getLatestBin.apply(store, arguments);
    },
    // Create a new bin.
    create: function (data, fn) {
      store.generateBinId(function (err, id) {
        if (err) {
          return fn(err);
        }

        data.url = id;
        data.revision = 1;
        data.streamingKey = bin.createStreamingKey(id, data.revision);

        store.setBin(data, function (err, id) {
          data.id = id;
          fn(err || null, err ? undefined : data);
        });
      });
    },
    createRevision: function (data, fn) {
      data.streamingKey = bin.createStreamingKey(data.url, data.revision);
      store.setBin(data, function (err, id) {
        data.id = id;
        fn(err || null, err ? undefined : data);
      });
    },
    // Create a new revision.
    updatePanel: function (panel, data, fn) {
      store.setBinPanel.apply(store, arguments);
    },
    createStreamingKey: function (id, rev) {
      var key = "" + id + rev + Math.random();
      return crypto.createHash('md5').update(key).digest('hex');
    }
  };
  return bin;
};
