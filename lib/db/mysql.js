var mysql = require('mysql'),
    templates = require("./sql_templates"),
    utils = require('../utils'),
    MySQL;

MySQL = module.exports = function MySQL(options) {
  this.connection = mysql.createClient(options);
};

MySQL.prototype = {
  defaults: {html: '', css: '', javascript: ''},
  constructor: MySQL,
  connect: function (fn) {
    this.connection.useDatabase(this.connection.database, fn);
  },
  disconnect: function (fn) {
    this.connection.end(fn);
  },
  getBin: function (params, fn) {
    var values = [params.id, params.revision],
        _this = this;

    this.connection.query(templates.getBin, values, function (err, results) {
      if (err || !results.length) {
        return fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, _this.applyBinDefaults(results[0]));
    });
  },
  setBin: function (params, fn) {
    var values = [
      params.javascript || '',
      params.css || '',
      params.html || '',
      params.url,
      params.revision,
      params.streamingKey
    ], sql = templates.setBin;

    this.connection.query(sql, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }
      fn(null, result.insertId);
    });
  },
  setBinUser: function (params, fn) {
    var sql = templates.setBinForUser,
        values = [params.name, params.url, params.revision];

    // TODO: Re-factor common callbacks into helpers.
    this.connection.query(sql, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }
      fn(null, result.insertId);
    });
  },
  setBinPanel: function (panel, params, fn) {
    var values = [
      params[panel],
      params.url,
      params.revision,
      params.streamingKey
    ],
    allowed = {html: 1, css: 1, javascript: 1},
    sql = templates.setBinPanel.replace(':panel', panel);

    if (allowed[panel]) {
      this.connection.query(sql, values, function (err, result) {
        if (err || !result.affectedRows) {
          return fn(err || 'no-entry');
        }
        fn(null, result.insertId);
      });
    } else {
      fn('invalid-panel');
    }
  },
  getLatestBin: function (params, fn) {
    var values = [params.id],
        sql = templates.getLatestBin,
        _this = this;

    this.connection.query(sql, values, function (err, results) {
      if (err || !results.length) {
        return fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, _this.applyBinDefaults(results[0]));
    });
  },
  getBinsByUser: function (id, fn) {
    var sql = templates.getBinsByUser,
        query = this.connection.query.bind(this.connection),
        _this = this;

    query(sql, [id], function (err, results) {
      var sql = templates.getBinByUrlAndRevision,
          collected = [],
          remaining = results.length,
          hasErrored;

      if (err) {
        return fn(err);
      }

      // i.e. if they've never saved anything before
      if (results.length === 0) {
        fn(null, collected);
      }

      function onComplete(err, results) {
        remaining -= 1;
        if (err) {
          // This could be more elegant but will likely do for now.
          if (!hasErrored) {
            fn(err);
          }
          return;
        }

        if (results[0]) {
          collected.push(_this.applyBinDefaults(results[0]));
        }

        if (remaining === 0) {
          fn(null, collected);
        }
      }

      results.forEach(function (result) {
        query(sql, [result.url, result.revision], onComplete);
      });
    });
  },
  generateBinId: function (fn, attempts) {
    var id = utils.shortcode(), mysql = this;

    attempts = attempts || 1;
    if (attempts <= 10) {
      this.connection.query(templates.binExists, [id], function (err, results) {
        if (err) {
          fn(err);
        } else if (results.length) {
          attempts += 1;
          mysql.generateBinId(fn, attempts);
        } else {
          fn(null, id);
        }
      });
    } else {
      fn("too-many-tries"); // Need error objects.
    }
  },
  getUser: function (id, fn) {
    this.connection.query(templates.getUser, [id], function (err, results) {
      if (err || !results.length) {
        return fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, results[0]);
    });
  },
  setUser: function (params, fn) {
    var values = [
      params.name,
      params.key,
      params.email
    ], sql = templates.setUser;

    this.connection.query(sql, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }
      fn(null, result.insertId);
    });
  },
  touchLogin: function (id, fn) {
    this.connection.query(templates.touchLogin, [id], function (err, results) {
      if (err || !results.affectedRows) {
        return fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, results.insertId);
    });
  },
  updateUserKey: function (id, key, fn) {
    this.connection.query(templates.updateUserKey, [key, id], function (err, results) {
      if (err || !results.affectedRows) {
        return fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, results.insertId);
    });
  },
  applyBinDefaults: function (bin) {
    for (var prop in this.defaults) {
      if (bin[prop] == null) { // Using == to catch null and undefined.
        bin[prop] = this.defaults[prop];
      }
    }
    return bin;
  }
};
