var sqlite3 = require('sqlite3').verbose(),
    templates = require('./sql_templates'),
    utils = require('../utils'),
    fs = require('fs');

module.exports = utils.inherit(Object, {
  defaults: null,
  constructor: function SQLite(options) {
    this.defaults = {html: '', css: '', javascript: ''};
    this.database = options.location;
  },
  connect: function (fn) {
    var self = this;
    this.connection = new sqlite3.Database(this.database, function () {
      self.connection.on('trace', function (query) {
        console.error(query);
      });

      fs.readFile(__dirname + '/../../build/full-db-v3.sqlite.sql', 'utf8', function (err, sql) {
        if (err) {
          console.error(err);
          return;
        }
        self.connection.serialize(function () {
          sql.split(/\n/).forEach(function (sql) {
            sql = sql.trim();
            if (sql) {
              self.connection.run(sql);
            }
          });
          fn();
        });
      });
    });
  },
  disconnect: function (fn) {
    this.connection.close();
    fn();
  },
  getBin: function (params, fn) {
    var values = [params.id, params.revision],
        _this = this;

    this.connection.get(templates.getBin, values, function (err, result) {
      if (err || result === undefined) {
        return fn(!err && result === undefined ? 'not-found' : err);
      }
      fn(null, _this.applyBinDefaults(result));
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

    this.connection.run(sql, values, function (err) {
      if (err || !this.changes) {
        return fn(err);
      }
      fn(null, this.lastID);
    });
  },
  setBinUser: function (params, fn) {
    var sql = templates.setBinForUser,
        values = [params.name, params.url, params.revision];

    // TODO: Re-factor common callbacks into helpers.
    this.connection.run(sql, values, function (err) {
      if (err || !this.changes) {
        return fn(err);
      }
      fn(null, this.lastID);
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
      this.connection.run(sql, values, function (err) {
        if (err || !this.changes) {
          return fn(err || 'no-entry');
        }
        fn(null, this.lastID);
      });
    } else {
      fn('invalid-panel');
    }
  },
  getLatestBin: function (params, fn) {
    var values = [params.id],
        sql = templates.getLatestBin,
        _this = this;

    this.connection.get(sql, values, function (err, result) {
      if (err || result === undefined) {
        return fn(!err && result === undefined ? 'not-found' : err);
      }
      fn(null, _this.applyBinDefaults(result));
    });
  },
  getLatestBinForUser: function (id, fn) {
    var sql = templates.getLatestBinForUser,
        query = this.connection.get(this.connection),
        _this = this;

    query(sql, [id], function (err, result) {
      var sql = templates.getBinByUrlAndRevision;

      if (err) {
        return fn(err);
      }

      if (typeof result === 'undefined') {
        return fn(null, null);
      }

      _this.getBin({ id: result.url, revision: result.revision }, fn);
    });
  },
  getBinsByUser: function (id, fn) {
    var sql = templates.getBinsByUser,
        query = this.connection.all.bind(this.connection),
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
      this.connection.get(templates.binExists, [id], function (err, result) {
        if (err) {
          fn(err);
        } else if (result) {
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
    this.connection.all(templates.getUser, [id], function (err, results) {
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

    this.connection.run(sql, values, function (err) {
      if (err || !this.changes) {
        return fn(err);
      }
      fn(null, this.lastID);
    });
  },
  touchLogin: function (id, fn) {
    var now = new Date();
    this.connection.run(templates.touchLogin, [id, now], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null, this.lastID);
    });
  },
  updateUserEmail: function (id, email, fn) {
    var now = new Date();
    this.connection.run(templates.updateUserEmail, [email, now, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  updateUserKey: function (id, key, fn) {
    var now = new Date();
    this.connection.run(templates.updateUserKey, [key, now, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null, this.lastID);
    });
  },
  getUserByForgotToken: function (token, fn) {
    var sql = templates.getUserForForgotToken;

    this.connection.run(sql, [token, new Date()], function (err, results) {
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

    this.connection.run(sql, params, function (err, result) {
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

    this.connection.run(sql, [new Date(), token, null], function (err, results) {
      fn(err || null);
    });
  },
  expireForgotTokenByUser: function (user, fn) {
    var sql = templates.deleteExpiredForgotToken;

    this.connection.run(sql, [new Date(), null, user], function (err, results) {
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
      if (bin[prop] === null) { // Using == to catch null and undefined.
        bin[prop] = this.defaults[prop];
      }
    }
    return bin;
  }
});
