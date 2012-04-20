var crypto = require('crypto');

module.exports = function (store) {
  var bin = {
    load: function (params, fn) {
      store.getBin(params, fn);
    },
    latest: function (params, fn) {
      store.getLatestBin(params, fn);
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
    // Create a new revision.
    update: function () {},
    createStreamingKey: function (id, rev) {
      var key = "" + id + rev + Math.random();
      return crypto.createHash('md5').update(key).digest('hex');
    }
  };
  return bin;
};
