var postgresql = require('pg'),
    sourceTemplates = require("./sql_templates"),
    utils = require('../utils'),
    templates = {},
    paramIndex,
    replaceQuestionWithNumberParam = function() { return "$" + paramIndex++; };

for (var id in sourceTemplates) {
  paramIndex = 1;
  if (sourceTemplates.hasOwnProperty(id)) {
    // replace all ? parameters with numbered postgre params such as $1, $2, $3
    templates[id] = sourceTemplates[id].
      replace(/\?/g, replaceQuestionWithNumberParam).
      replace(/`/g,'').
      replace(/^(INSERT INTO .*)$/, function($1) { return $1 + ' RETURNING id' }); // get the ID for any inserted rows as a result
  }
}

module.exports = utils.inherit(Object, {
  defaults: null,
  constructor: function PostgreSQL(options) {
    this.options    = options;
    this.defaults   = {html: '', css: '', javascript: ''};
    this.client = new postgresql.Client(options.connection);
  },
  connect: function (fn) {
    this.client.connect(fn);
  },
  disconnect: function (fn) {
    this.client.end(fn);
  },
  getBin: function (params, fn) {
    // This is not the 'id' it's the URL field.
    var values = [params.id, params.revision],
        _this = this;

    this.client.query(templates.getBin, values, function (err, results) {
      if (err) {
        return fn(err);
      }
      fn(null, results.rows[0] && _this.applyBinDefaults(results.rows[0]));
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
      params.streamingKey,
      params.settings
    ], sql = templates.setBin;

    this.client.query(sql, values, function (err, result) {
      if (err || !result.rowCount) {
        return fn(err);
      }
      fn(null, result.rows[0].id);
    });
  },
  setBinOwner: function (params, fn) {
    var sql = templates.setBinOwner,
        values = [params.name, params.url, params.revision, new Date(), params.summary, params.html, params.css, params.javascript];

    // TODO: Re-factor common callbacks into helpers.
    this.client.query(sql, values, function (err, result) {
      if (err || !result.rowCount) {
        return fn(err);
      }
      fn(null, result.rows[0].id);
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
      this.client.query(sql, values, function (err, result) {
        if (err || !result.rowCount) {
          return fn(err || 'no-entry');
        }
        this.getBin({ id: params.url, revision: params.revision }, function(err, result) {
          if (err) {
            return fn(err);
          }
          fn(null, result.rows[0].id);
        });
      });
    } else {
      fn('invalid-panel');
    }
  },
  getLatestBin: function (params, fn) {
    var values = [params.id],
        sql = templates.getLatestBin,
        _this = this;

    this.client.query(sql, values, function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, result.rows[0] && _this.applyBinDefaults(result.rows[0]));
    });
  },
  getLatestBinForUser: function (id, fn) {
    var sql = templates.getLatestBinForUser,
        query = this.client.query.bind(this.client),
        _this = this;

    query(sql, [id], function (err, result) {
      var sql = templates.getBinByUrlAndRevision;

      if (err) {
        return fn(err);
      }

      // i.e. if they've never saved anything before
      if (result.rows.length === 0) {
        fn(null, null);
      }

      _this.getBin({ id: result.rows[0].url, revision: result.rows[0].revision }, fn);
    });
  },
  getBinsByUser: function (id, fn) {
    var sql = templates.getBinsByUser,
        query = this.client.query.bind(this.client),
        _this = this;

    query(sql, [id], function (err, result) {
      if (err) {
        return fn(err);
      }

      var sql = templates.getBinByUrlAndRevision,
          collected = [];

      // i.e. if they've never saved anything before
      result.rows.forEach(function (resultRow) {
        collected.push(_this.applyBinDefaults(resultRow));
      });
      fn(null, collected);
    });
  },
  // Get all bins from the owners field
  getAllOwners: function (fn) {
    // Get all the 'owned' bins
    this.client.query(templates.getAllOwners, [], function(err, result) {
      fn(err, result.rows);
    });
  },
  getOwnersBlock: function (start, size, fn) {
    // Get all the 'owned' bins
    this.client.query(templates.getOwnersBlock, [start, size], function(err, result) {
      fn(err, result.rows);
    });
  },
  generateBinId: function (fn, attempts) {
    var id = utils.shortcode(), postgresql = this;

    attempts = attempts || 1;
    if (attempts <= 10) {
      this.client.query(templates.binExists, [id], function (err, result) {
        if (err) {
          fn(err);
        } else if (result.rows.length) {
          attempts += 1;
          postgresql.generateBinId(fn, attempts);
        } else {
          fn(null, id);
        }
      });
    } else {
      fn("too-many-tries"); // Need error objects.
    }
  },
  archiveBin: function (bin, fn) {
    var values = [bin.archive, bin.name, bin.url, bin.revision],
        sql = templates.archiveBin;

    this.client.query(sql, values, function (err, result) {
      if (err || !result.rowCount) {
        return fn(err);
      }
      fn(null, result.rows);
    });
  },
  getUser: function (id, fn) {
    var _this = this;
    this.client.query(templates.getUser, [id], function (err, result) {
      if (err) {
        return fn(err);
      } else if (result.rows.length === 0) {
        _this.client.query(templates.getUserByEmail, [id], function (err, result) {
          if (err) {
            return fn(err);
          }

          fn(null, result.rows[0]);
        });
      } else {
        fn(null, result.rows[0]);
      }
    });
  },
  getUserByApiKey: function (apiKey, fn) {
    this.client.query(templates.getUserByApiKey, [apiKey], function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, result.rows[0]);
    });
  },
  getUserByEmail: function (email, fn) {
    this.client.query(templates.getUserByEmail, [email], function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, result.rows[0]);
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

    this.client.query(sql, values, function (err, result) {
      if (err || !result.rowCount) {
        return fn(err);
      }
      fn(null, result.rows[0].id);
    });
  },
  touchOwners: function (params, fn) {
    // params.date is only for use when populating the summary field
    var values = [params.date || new Date(), params.name, params.url, params.revision];

    this.client.query(templates.touchOwners, values, function (err, result) {
      if (err || !result.rowCount) {
        return fn(err);
      }

      if (typeof fn === 'function') {
        fn(null, null); // TODO: This should be consistent with the other drivers, but this value is not used
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
      this.client.query(sql, values, function (err, result) {
        if (err || !result.rowCount) {
          return fn(err);
        }

        if (typeof fn === 'function') {
          fn(null, null); // TODO: This should be consistent with the other drivers, but this value is not used
        }
      });
    } else {
      fn('invalid-panel');
    }
  },
  populateOwners: function (params, fn) {
    // params.date is only for use when populating the summary field
    var values = [params.date || new Date(), params.summary, params.html, params.css, params.javascript, params.name, params.url, params.revision];

    this.client.query(templates.populateOwners, values, function (err, result) {
      if (err || !result.rowCount) {
        return fn(err);
      }

      if (typeof fn === 'function') {
        fn(null, null); // TODO: This should be consistent with the other drivers, but this value is not used
      }
    });
  },
  touchLogin: function (id, fn) {
    var now = new Date();
    this.client.query(templates.touchLogin, [now, id], function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  updateUserEmail: function (id, email, fn) {
    var now = new Date();
    this.client.query(templates.updateUserEmail, [email, now, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  updateUserKey: function (id, key, fn) {
    var now = new Date();
    this.client.query(templates.updateUserKey, [key, now, id], function (err) {
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
    this.client.query(templates.upgradeUserKey, [key, now, now, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  getUserByForgotToken: function (token, fn) {
    var sql = templates.getUserForForgotToken;

    this.client.query(sql, [token, new Date()], function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, result.rows[0]);
    });
  },
  setForgotToken: function (user, token, fn) {
    var sql = templates.setForgotToken,
        expires = this.expireDate(),
        params = [user, token, expires, new Date()];

    this.client.query(sql, params, function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, result.rows[0].id);
    });
  },
  expireForgotToken: function (token, fn) {
    var sql = templates.deleteExpiredForgotToken;

    // Allow all old tokens to be expired with same call.
    if (typeof token === 'function') {
      fn = token;
      token = null;
    }

    this.client.query(sql, [new Date(), token, null], function (err, result) {
      fn(err || null);
    });
  },
  expireForgotTokenByUser: function (user, fn) {
    var sql = templates.deleteExpiredForgotToken;

    this.client.query(sql, [new Date(), null, user], function (err, result) {
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

    this.client.query(sql, values, function (err, result) {
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

    this.client.query(sql, values, function (err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, { found: !!result.rowCount.length, isowner: result.rowCount.length ? result.rows[0].owner === 1 : false });
    });
  }
});
