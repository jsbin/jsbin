var sqlite3 = require('sqlite3').verbose(),
    templates = require('./sql_templates'),
    utils = require('../utils'),
    fs = require('fs');

var noop = function () {};

module.exports = utils.inherit(Object, {
  defaults: null,
  constructor: function SQLite(options) {
    this.defaults = {html: '', css: '', javascript: ''};
    this.database = options.location;
  },
  connect: function (fn) {
    var self = this;
    this.connection = new sqlite3.Database(this.database, function () {
      fs.readFile(__dirname + '/../../build/full-db-v3.sqlite.sql', 'utf8', function (err, sql) {
        if (err) {
          return fn(err);
        }
        self.connection.serialize(function () {
          sql = sql.trim();
          if (sql) {
            self.connection.exec(sql, fn);
          } else {
            fn();
          }
        });
      });
    });
  },
  disconnect: function (fn) {
    this.connection.close();
    fn();
  },
  getBin: function (params, fn) {
    var values = [params.id, params.revision, params.revision],
        _this = this;

    this.connection.get(templates.getBin, values, function (err, result) {
      if (err) {
        return fn(err);
      }

      if (result) {
        result = _this.convertBinDates(result);
      }

      fn(null, result && _this.applyBinDefaults(result));
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

    this.connection.run(sql, values, function (err) {
      if (err || !this.changes) {
        return fn(err);
      }
      fn(null, this.lastID);
    });
  },
  setBinOwner: function (params, fn) {
    var sql = templates.setBinOwner,
        values = [params.name, params.url, params.revision, new Date(), params.summary, params.html, params.css, params.javascript, params.visibility || 'public'];

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
      params.settings,
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
      if (err) {
        return fn(err);
      }

      if (result) {
        result = _this.convertBinDates(result);
      }

      fn(null, result && _this.applyBinDefaults(result));
    });
  },
  getLatestBinForUser: function (id, n, fn) {
    var sql = templates.getLatestBinForUser,
        query = this.connection.get.bind(this.connection),
        _this = this;

    query(sql, [id, n], function (err, result) {
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
        _this = this;

    this.connection.all(sql, [id], function (err, results) {
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
    this.connection.run(templates.getAllOwners, [], fn);
  },
  getOwnersBlock: function (start, size, fn) {
    // Get all the 'owned' bins
    this.connection.run(templates.getOwnersBlock, [start, size], fn);
  },
  generateBinId: function (length, attempts, fn) {
    var id = utils.shortcode(), mysql = this;

    attempts = attempts || 1;
    if (attempts <= 10) {
      this.connection.get(templates.binExists, [id], function (err, result) {
        if (err) {
          fn(err);
        } else if (result) {
          attempts += 1;
          mysql.generateBinId(length, attempts, fn);
        } else {
          fn(null, id);
        }
      });
    } else {
      fn(new Error("too-many-tries"));
    }
  },
  // getOne('<sql template>', [constraint1, constraint2, ...], fn)
  getOne: function (queryKey, params, fn) {
    this.connection.get(templates[queryKey], params, function (err, result) {
      if (err) {
        fn(err, null);
      } else {
        fn(null, result);
      }
    });
  },
  getUser: function (id, fn) {
    var _this = this;

    this.connection.get(templates.getUser, [id], function (err, result) {
      if (err) {
        return fn(err);
      }

      if (!result) {
        _this.connection.get(templates.getUserByEmail, [id], function (err, result) {
          if (err) {
            return fn(err);
          }

          if (result) {
            result = _this.convertUserDates(result);
          }

          fn(null, result);
        });
      } else {
        if (result) {
          result = _this.convertUserDates(result);
        }
        fn(null, result);
      }
    });
  },
  getUserByApiKey: function (apiKey, fn) {
    var _this = this;

    this.connection.get(templates.getUserByApiKey, [apiKey], function (err, result) {
      if (err) {
        return fn(err);
      }

      if (result) {
        result = _this.convertUserDates(result);
      }
      fn(null, result);
    });
  },
  getUserByEmail: function (email, fn) {
    var _this = this;

    this.connection.get(templates.getUserByEmail, [email], function (err, result) {
      if (err) {
        return fn(err);
      }

      if (result) {
        result = _this.convertUserDates(result);
      }

      fn(null, result);
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
      params.github_token,
      params.github_id,
      params.flagged || false,
    ], sql = templates.setUser;

    this.connection.run(sql, values, function (err) {
      if (err) {
        return fn(err);
      }
      fn(null, this.lastID);
    });
  },
  touchOwners: function (params, fn) {
    // params.date is only for use when populating the summary field
    var values = [params.date || new Date(), params.name, params.url, params.revision];

    this.connection.run(templates.touchOwners, values, function (err) {
      if (err) {
        return fn(err);
      }

      if (typeof fn === 'function') {
        fn(null);
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
      this.connection.run(sql, values, function (err) {
        if (err) {
          return fn(err);
        }

        if (typeof fn === 'function') {
          fn(null);
        }
      });
    } else {
      fn('invalid-panel');
    }
  },
  populateOwners: function (params, fn) {
    // params.date is only for use when populating the summary field
    var values = [params.date || new Date(), params.summary, params.html, params.css, params.javascript, params.name, params.url, params.revision];

    this.connection.run(templates.populateOwners, values, function (err, result) {
      if (err) {
        return fn(err);
      }

      if (typeof fn === 'function') {
        fn(null);
      }
    });
  },
  touchLogin: function (id, fn) {
    var now = new Date();
    this.connection.run(templates.touchLogin, [now, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null);
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
  updateUserSettings: function(id, settings, fn) {
    this.connection.run(templates.updateUserSettings, [JSON.stringify(settings), id], function(err){
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  updateUserGithubData: function (id, ghId, token, fn) {
    var now = new Date();
    this.connection.run(templates.updateUserGithubData, [ghId, token, now, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  updateUserDropboxData: function (id, token, fn) {
    fn(null);
  },
  updateUserKey: function (id, key, fn) {
    var now = new Date();
    this.connection.run(templates.updateUserKey, [key, now, id], function (err) {
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
    this.connection.run(templates.upgradeUserKey, [key, now, now, id], function (err) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  getUserByForgotToken: function (token, fn) {
    var sql = templates.getUserForForgotToken,
        _this = this;

    this.connection.get(sql, [token, new Date()], function (err, result) {
      if (err) {
        return fn(err);
      }

      if (result) {
        result = _this.convertUserDates(result);
      }

      fn(null, result);
    });
  },
  setForgotToken: function (user, token, fn) {
    var sql = templates.setForgotToken,
        expires = this.expireDate(),
        params = [user, token, expires, new Date()];

    this.connection.run(sql, params, function (err) {
      if (err) {
        return fn(err);
      }
      fn();
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

    this.connection.run(sql, [new Date(), null, user], function (err) {
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

    this.convertDates(bin, 'last_updated');

    if (!bin.last_updated || isNaN(bin.last_updated.getTime())) bin.last_updated = new Date('2012-07-23 00:00:00');

    try {
      bin.settings = JSON.parse(bin.settings || '{}');
    } catch (e) {
      // this is likely because the settings were screwed in a beta build
      bin.settings = {};
    }

    return bin;
  },
  convertUserDates: function (user) {
    return this.convertDates(user, 'created', 'updated', 'last_login');
  },
  convertBinDates: function (bin) {
    return this.convertDates(bin, 'created', 'last_viewed');
  },
  convertDates: function (obj/* keys */) {
    var keys = [].slice.call(arguments, 1);
    keys.forEach(function (key) {
      if (obj && obj[key]) {
        var date = new Date();
        date.setTime(obj[key]);
        obj[key] = date;
      }
    });
    return obj;
  },
  reportBin: function (params, fn) {
    var now = new Date(), values = [
      now,
      params.url,
      params.revision
    ], sql = templates.reportBin;

    this.connection.run(sql, values, function (err) {
      if (err) {
        return fn(err);
      }
      fn(null);
    });
  },
  archiveBin: function (bin, fn) {
    var values = [bin.archive, bin.name, bin.url, bin.revision],
        sql = templates.archiveBin;

    this.connection.run(sql, values, function (err, result) {
      if (err || !this.changes) {
        return fn(err);
      }
      fn(null, result);
    });
  },
  isOwnerOf: function (params, fn) {
    var values = [
      params.name || '',
      params.url
    ], sql = templates.isOwnerOf;

    // note: .get gets one row
    this.connection.get(sql, values, function (err, result) {
      if (err) {
        return fn(err);
      }
      if (typeof result === 'undefined') {
        return fn(null, { found: false });
      } else {
        return fn(null, { found: true, isowner: result.owner === 1, result: result });
      }
    });
  },
  getUserBinCount: function (id, fn) {
    var values = [id],
        sql = templates.getUserBinCount;

    this.connection.get(sql, values, function (err, result) {
      if (err) {
        return fn(err);
      }
      if (typeof result === 'undefined') {
        return fn(null, { found: false, total: 0 });
      } else {
        return fn(null, { found: true, total: result.total });
      }
    });
  },
  getBinMetadata: function(bin, fn) {
    var sql = templates.getBinMetadata;
    this.connection.get(sql, [bin.url, bin.revision], function(err, result) {
      if (err) {
        return fn(err);
      }
      fn(null, (result && result.length > 0 && result[0]) ? result[0] : {
        visibility: 'public',
        name: 'anonymous'
      });
    });
  },
  setBinVisibility: function(bin, name, value, fn) {
    var sql = templates.setBinVisibility, params = [
      value, name, bin.url
    ];
    if (!bin.metadata || bin.metadata.name !== name) {
      return fn(301);
    }
    this.connection.run(sql, params, function(err, result) {
      if (err) {
        return fn(500);
      }
      fn(err, result);
    });
  },
  setCustomer: noop,
  setCustomerActive: noop,
  getCustomerByStripeId: noop,
  getCustomerByUser: noop,
  getUserListing: function (user, fn) {
    var sql = templates.userListing;
    this.connection.get(sql, [user], fn);
  },
  setProAccount: function(id, pro, fn){
    this.connection.run(templates.setProAccount, [pro, new Date(), id], fn);
  },
  updateBinData: updateMultipleFields(templates.updateBinData, templates.sandboxColumns),
  updateOwnersData: updateMultipleFields(templates.updateOwnersData, templates.ownersColumns),
  updateOwnershipData: updateMultipleFields(templates.updateOwnershipData, templates.ownershipColumns),
  saveBookmark: function (params, fn) {
    var sql = templates.saveBookmark;
    this.connection.run(sql, [params.name, params.url, params.revision, params.type], fn);
  },
  getBookmark: function (params, fn) {
    var sql = templates.getBookmark;
    this.connection.get(sql, [params.name, params.type], function (error, result) {
      if (error || !result.length) {
        return fn(error || { notfound: true });
      }
      fn(null, result);
    });
  },
  getAssetsForUser: noop,
  deleteAsset: noop,
  saveAsset: noop
});


function updateMultipleFields(sqlTemplate, columnsArray) {
  return function (bin, params, fn) {
    var values = [];
    var queries = Object.keys(params).map(function(key) {
      if (columnsArray.indexOf(key) === -1) {
        throw new Error('Warning: attempt to update sandbox table with invalid field "' + key + '"');
      }
      values.push(params[key]);
      return '`' + key + '`=?';
    });

    values.push(bin.url);
    values.push(bin.revision);

    var sql = sqlTemplate.replace('`:field`=?', queries.join(', '));

    this.connection.run(sql, values, fn);
  };
}
