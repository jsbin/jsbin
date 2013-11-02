var mysql = require('mysql'),
    templates = require("./sql_templates"),
    utils = require('../utils');

module.exports = utils.inherit(Object, {
  defaults: null,
  constructor: function MySQL(options) {
    this.options    = options;
    this.defaults   = {html: '', css: '', javascript: ''};
    this.connection = mysql.createClient(options);
  },
  connect: function (fn) {
    // Allow us to override the default charset. node-mysql does not allow us
    // to provide utf8mb4 as a charset, as it uses predefined constants. So we
    // work around this by passing a string. If the user has overridden this
    // in their config then we skip this step.
    if (typeof this.options.charset === 'string') {
      var params = [this.options.charset, this.options.collate];
      this.connection.query('SET NAMES ? COLLATE ?', params, fn);
    } else {
      fn();
    }
  },
  disconnect: function (fn) {
    this.connection.end(fn);
  },
  getBin: function (params, fn) {
    // This is not the 'id' it's the URL field.
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
      params.streamingKey,
      params.settings
    ], sql = templates.setBin;

    this.connection.query(sql, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }
      fn(null, result.insertId);
    });
  },
  setBinOwner: function (params, fn) {
    var sql = templates.setBinOwner,
        values = [params.name, params.url, params.revision, new Date(), params.summary, params.html, params.css, params.javascript];

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
          params.settings,
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
  getLatestBinForUser: function (id, n, fn) {
    var sql = templates.getLatestBinForUser,
        query = this.connection.query.bind(this.connection),
        _this = this;

    query(sql, [id, n], function (err, result) {
      var sql = templates.getBinByUrlAndRevision;

      if (err) {
        return fn(err);
      }

      // i.e. if they've never saved anything before
      if (result.length === 0) {
        return fn(null, null);
      }

      _this.getBin({ id: result[0].url, revision: result[0].revision }, fn);
    });
  },
  getBinsByUser: function (id, fn) {
    var sql = templates.getBinsByUser,
        query = this.connection.query.bind(this.connection),
        _this = this;

    query(sql, [id], function (err, results) {
      if (err) {
        return fn(err);
      }

      var sql = templates.getBinByUrlAndRevision,
          collected = [];

      // i.e. if they've never saved anything before
      results.forEach(function (result) {
        collected.push(_this.applyBinDefaults(result));
      });
      fn(null, collected);
    });
  },
  // Get all bins from the owners field
  getAllOwners: function (fn) {
    // Get all the 'owned' bins
    this.connection.query(templates.getAllOwners, [], fn);
  },
  getOwnersBlock: function (start, size, fn) {
    // Get all the 'owned' bins
    this.connection.query(templates.getOwnersBlock, [start, size], fn);
  },
  generateBinId: function (fn, attempts) {
    attempts = attempts || 1;

    var id = utils.shortcode(3 + attempts), mysql = this;

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
      fn(new Error("too-many-tries"))
    }
  },
  archiveBin: function (bin, fn) {
    var values = [bin.archive, bin.name, bin.url, bin.revision],
        sql = templates.archiveBin;

    this.connection.query(sql, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }
      fn(null, result);
    });
  },
  getUser: function (id, fn) {
    var _this = this;
    this.connection.query(templates.getUser, [id], function (err, results) {
      if (err) {
        return fn(err);
      } else if (results.length === 0) {
        _this.connection.query(templates.getUserByEmail, [id], function (err, results) {
          if (err) {
            return fn(err);
          }

          fn(null, results[0]);
        });
      } else {
        fn(null, results[0]);
      }
    });
  },
  getUserByApiKey: function (apiKey, fn) {
    this.connection.query(templates.getUserByApiKey, [apiKey], function (err, results) {
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
      now,
      params.github_token || null,
      params.github_id || null,
    ], sql = templates.setUser;

    this.connection.query(sql, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }
      fn(null, result.insertId);
    });
  },
  touchOwners: function (params, fn) {
    // params.date is only for use when populating the summary field
    var values = [params.date || new Date(), params.name, params.url, params.revision];

    this.connection.query(templates.touchOwners, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }

      if (typeof fn === 'function') {
        fn(null, result.insertId);
      }
    });
  },
  updateOwners: function (params, fn) {
    // params.date is only for use when populating the summary field
    var values = [params.date || new Date(), params.summary, params.panel_open, params.name, params.url, params.revision];

    var panel = params.panel,
        allowed = {html: 1, css: 1, javascript: 1},
        sql = templates.updateOwners.replace(':panel', panel);

    if (allowed[panel]) {
      this.connection.query(sql, values, function (err, result) {
        if (err || !result.affectedRows) {
          return fn(err);
        }

        if (typeof fn === 'function') {
          fn(null, result.insertId);
        }
      });
    } else {
      fn('invalid-panel');
    }
  },
  populateOwners: function (params, fn) {
    // params.date is only for use when populating the summary field
    var values = [params.date || new Date(), params.summary, params.html, params.css, params.javascript, params.name, params.url, params.revision];

    this.connection.query(templates.populateOwners, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err);
      }

      if (typeof fn === 'function') {
        fn(null, result.insertId);
      }
    });
  },
  touchLogin: function (id, fn) {
    var now = new Date();
    this.connection.query(templates.touchLogin, [now, id], function (err, results) {
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
  updateUserGithubData: function (id, ghId, token, fn) {
    var now = new Date();
    this.connection.query(templates.updateUserGithubData, [ghId, token, now, id], function (err) {
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
  // Different to updateUserKey() in that it also sets the created timestamp
  // which is required to differentiate between a JSBin 2 user and a new
  // one.
  upgradeUserKey: function (id, key, fn) {
    var now = new Date();
    this.connection.query(templates.upgradeUserKey, [key, now, now, id], function (err) {
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

    if (!bin.last_updated || isNaN(bin.last_updated.getTime())) bin.last_updated = new Date('2012-07-23 00:00:00');

    try {
      bin.settings = JSON.parse(bin.settings || '{}');
    } catch (e) {
      // this is likely because the settings were screwed in a beta build
      bin.settings = {};
    }

    return bin;
  },
  reportBin: function (params, fn) {
    var now = new Date(), values = [
      now,
      params.url,
      params.revision
    ], sql = templates.reportBin;

    this.connection.query(sql, values, function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  isOwnerOf: function (params, fn) {
    var values = [
      params.name,
      params.url
    ], sql = templates.isOwnerOf;

    this.connection.query(sql, values, function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, { found: !!result.length, isowner: result.length ? result[0].owner === 1 : false });
    });
  },
  getUserBinCount: function (id, fn) {
    var values = [id],
        sql = templates.getUserBinCount;

    this.connection.query(sql, values, function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, { found: !!result.length, total: result.length ? result[0].total : 0 });
    });
  },
    // getOne('<sql template>', [constraint1, constraint2, ...], fn)
  getOne: function (queryKey, params, fn) {
    this.connection.query(templates[queryKey], params, function (err, result) {
      if (err) {
        fn(err, null);
      } else {
        fn(null, result.length ? result[0] : null);
      }
    });
  },
});
