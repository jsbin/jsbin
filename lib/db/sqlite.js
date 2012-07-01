var sqlite3 = require('sqlite3').verbose(),
    templates = require('./sqlite_templates'),
    utils = require('../utils'),
    fs = require('fs'),
    DB;

DB = module.exports = function DB(options) {
  this.database = options.location;
};

DB.prototype = {
  defaults: {html: '', css: '', javascript: ''},
  constructor: DB,
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
    var values = [
      params.javascript || '',
      params.css || '',
      params.html || '',
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

    this.connection.run(sql, values, function (err) {
      if (err || !this.changes) {
        return fn(err);
      }
      fn(null, this.lastID);
    });
  },
  touchLogin: function (id, fn) {
    this.connection.run(templates.touchLogin, [id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null, this.lastID);
    });
  },
  updateUserKey: function (id, key, fn) {
    this.connection.run(templates.updateUserKey, [key, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null, this.lastID);
    });
  },
  applyBinDefaults: function (bin) {
    for (var prop in this.defaults) {
      if (bin[prop] === null) { // Using == to catch null and undefined.
        bin[prop] = this.defaults[prop];
      }
    }
    return bin;
  }
};
