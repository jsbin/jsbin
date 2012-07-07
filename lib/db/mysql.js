var mysql = require('mysql'),
    templates = require("./sql_templates"),
    utils = require('../utils');

module.exports = utils.inherit(Object, {
  defaults: null,
  constructor: function MySQL(options) {
    this.defaults = {html: '', css: '', javascript: ''};
    this.connection = mysql.createClient(options);
  },
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
      if (err) {
        return fn(err);
      }
      fn(null, results[0] && _this.applyBinDefaults(results[0]));
    });
  },
  setBin: function (params, fn) {
    var now = new Date(), values = [
      params.javascript || '',
      params.css || '',
      params.html || '',
      now,
      now,
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
      new Date(),
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
      if (err) {
        return fn(err);
      }
      fn(null, results[0] && _this.applyBinDefaults(results[0]));
    });
  },
  getLatestBinForUser: function (id, fn) {
    var sql = templates.getLatestBinForUser,
        query = this.connection.query.bind(this.connection),
        _this = this;

    query(sql, [id], function (err, result) {
      var sql = templates.getBinByUrlAndRevision;

      if (err) {
        return fn(err);
      }

      // i.e. if they've never saved anything before
      if (result.length === 0) {
        fn(null, null);
      }

      _this.getBin({ id: result[0].url, revision: result[0].revision }, fn);
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
      if (err) {
        return fn(err);
      }
      fn(null, results[0]);
    });
  },
  getUserByEmail: function (email, fn) {
    this.connection.query(templates.getUserByEmail, [email], function (err, results) {
      if (err) {
        return fn(err);
      }
      fn(null, results[0]);
    });
  },
  setUser: function (params, fn) {
    var now = new Date(), values = [
      params.name,
      params.key,
      params.email,
      now,
      now,
      now
    ], sql = templates.setUser;

    this.connection.query(sql, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }
      fn(null, result.insertId);
    });
  },
  touchOwnership: function (params, fn) {
    var values = [new Date(), params.name, params.url, params.revision];

    this.connection.query(templates.touchOwnership, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }
      if (fn) fn(null, result.insertId);
    });
  },
  touchLogin: function (id, fn) {
    var now = new Date();
    this.connection.query(templates.touchLogin, [id, now], function (err, results) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  updateUserEmail: function (id, email, fn) {
    var now = new Date();
    this.connection.query(templates.updateUserEmail, [email, now, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  updateUserKey: function (id, key, fn) {
    var now = new Date();
    this.connection.query(templates.updateUserKey, [key, now, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  getUserByForgotToken: function (token, fn) {
    var sql = templates.getUserForForgotToken;

    this.connection.query(sql, [token, new Date()], function (err, results) {
      if (err) {
        return fn(err);
      }
      fn(null, results[0]);
    });
  },
  setForgotToken: function (user, token, fn) {
    var sql = templates.setForgotToken,
        expires = this.expireDate(),
        params = [user, token, expires, new Date()];

    this.connection.query(sql, params, function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, result.insertId);
    });
  },
  expireForgotToken: function (token, fn) {
    var sql = templates.deleteExpiredForgotToken;

    // Allow all old tokens to be expired with same call.
    if (typeof token === 'function') {
      fn = token;
      token = null;
    }

    this.connection.query(sql, [new Date(), token, null], function (err, results) {
      fn(err || null);
    });
  },
  expireForgotTokenByUser: function (user, fn) {
    var sql = templates.deleteExpiredForgotToken;

    this.connection.query(sql, [new Date(), null, user], function (err, results) {
      fn(err || null);
    });
  },
  expireDate: function () {
    var expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + 1);
    return expires;
  },
  applyBinDefaults: function (bin) {
    for (var prop in this.defaults) {
      if (bin[prop] == null) { // Using == to catch null and undefined.
        bin[prop] = this.defaults[prop];
      }
    }
    return bin;
  }
});
