'use strict';
var mysql = require('mysql'),
    templates = require('./sql_templates'),
    utils = require('../utils');

module.exports = utils.inherit(Object, {
  defaults: null,
  constructor: function MySQL(options) {
    this.options    = options;
    this.defaults   = {html: '', css: '', javascript: ''};
    this.connection = mysql.createPool(options);
    // note: the this.connection.connect() is implicit
  },
  connect: function (fn) {
    // this used to be conditional to set the charset on the database, but the
    // upgrade in node-mysql meant that we don't need it anymore, so we just
    // keep method for parity with the sqlite adapter.
    fn();
  },
  disconnect: function (fn) {
    this.connection.end(fn);
  },
  getBin: function (params, fn) {
    // This is not the 'id' it's the URL field.
    var values = [params.id, params.revision, params.revision],
        _this = this;

    this.connection.query(templates.getBin, values, function (err, results) {
      if (err) {
        return fn(err);
      }
      if (results.length > 1) {
        results[0].latest = false;
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
        values = [params.name, params.url, params.revision, new Date(), params.summary, params.html, params.css, params.javascript, params.visibility || 'public'];

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

      var collected = [];

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
  generateBinId: function (length, attempts, fn) {
    attempts = attempts || 1;
    var mysql = this;

    function tryurl(triesLeft, fn) {
      if (triesLeft === 0) {
        return fn(null, null);
      }

      var id = utils.shortcode(length + attempts);
      mysql.connection.query(templates.binExists, [id], function (err, results) {
        if (err) {
          fn(err);
        } else if (results.length) {
          tryurl(triesLeft - 1, fn);
        } else {
          fn(null, id);
        }
      });
    }

    if (attempts <= 10) {
      tryurl(3, function (err, id) {
        if (err) {
          return fn(err);
        } else if (id) {
          return fn(null, id);
        } else { // no id found
          mysql.generateBinId(length, attempts + 1, fn);
        }
      });
    } else {
      fn(new Error('too-many-tries'));
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
  getUser: function (id, fn, usernameOnly) {
    var _this = this;
    this.connection.query(templates.getUser, [id], function (err, results) {
      if (err) {
        return fn(err);
      } else if (results.length === 0 && !usernameOnly) {
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
      params.github_token || null, // jshint ignore:line
      params.github_id || null, // jshint ignore:line
      params.flagged || null,
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
    var values = [params.date || new Date(), params.summary, params.panel_open, params.name, params.url, params.revision]; //jshint ignore:line

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
    this.connection.query(templates.touchLogin, [now, id], fn);
  },
  updateUserEmail: function (id, email, fn) {
    var now = new Date();
    this.connection.query(templates.updateUserEmail, [email, now, id], fn);
  },
  updateUserSettings: function(id, settings, fn) {
    this.connection.query(templates.updateUserSettings, [JSON.stringify(settings), id], fn);
  },
  updateUserGithubData: function (id, ghId, token, fn) {
    var now = new Date();
    this.connection.query(templates.updateUserGithubData, [ghId, token, now, id], fn);
  },
  updateUserDropboxData: function (id, token, fn) {
    var now = new Date();
    this.connection.query(templates.updateUserDropboxData, [token, now, id], fn);
  },
  updateUserKey: function (id, key, fn) {
    var now = new Date();
    this.connection.query(templates.updateUserKey, [key, now, id], fn);
  },
  // Different to updateUserKey() in that it also sets the created timestamp
  // which is required to differentiate between a JSBin 2 user and a new
  // one.
  upgradeUserKey: function (id, key, fn) {
    var now = new Date();
    this.connection.query(templates.upgradeUserKey, [key, now, now, id], fn);
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

    this.connection.query(sql, [new Date(), token, null], fn);
  },
  expireForgotTokenByUser: function (user, fn) {
    var sql = templates.deleteExpiredForgotToken;

    this.connection.query(sql, [new Date(), null, user], fn);
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

    if (!bin.last_updated || bin.last_updated === '0000-00-00 00:00:00' || isNaN(bin.last_updated.getTime())) { // jshint ignore:line
      bin.last_updated = new Date('2012-07-23 00:00:00'); // jshint ignore:line
    }

    if (bin.latest === undefined) {
      bin.latest = true;
    }

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

    this.connection.query(sql, values, fn);
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
      fn(null, { found: !!result.length, isowner: result.length ? result[0].owner === 1 : false, result: result[0] });
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
  getBinMetadata: function(bin, fn) {
    var sql = templates.getBinMetadata;
    this.connection.query(sql, [bin.url, bin.revision], function(err, result) {
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
      return fn(401);
    }
    this.connection.query(sql, params, function(err, result) {
      if (err) {
        return fn(500);
      }
      fn(err, result);
    });
  },
  setCustomer: function (params, fn) {
    var values = [
      params.stripeId,
      params.userId || null,
      params.user,
      params.plan,
    ], sql = templates.setCustomer;

    // not using callbacks atm
    fn = fn || function() {};

    this.connection.query(sql, values, function (err, result) {
      if (err || !result.affectedRows) {
        return fn(err || new Error('unable to set customer'));
      }
      fn(null, result);
    });
  },
  setCustomerActive: function (user, active, fn) {
    var sql = templates.setCustomerActive;
    this.connection.query(sql, [active, user], fn);
  },
  getCustomerByStripeId: function(id, fn) {
    var sql = templates.getCustomerByStripeId;
    this.connection.query(sql, [id], fn);
  },
  getUserListing: function (user, fn) {
    var sql = templates.userListing;
    this.connection.query(sql, [user], fn);
  },
  getCustomerByUser: function(user, fn) {
    var sql = templates.getCustomerByUser;
    this.connection.query(sql, [user.name], function(err, result) {
      if (err || !result) {
        return fn(err || new Error('unable to find customer'));
      }
      fn(null, result);
    });
  },
  setProAccount: function(id, pro, fn) {
    this.connection.query(templates.setProAccount, [pro, new Date(), id], fn);
  },
  updateBinData: updateMultipleFields(templates.updateBinData, templates.sandboxColumns),
  updateOwnersData: updateMultipleFields(templates.updateOwnersData, templates.ownersColumns),
  updateOwnershipData: updateMultipleFields(templates.updateOwnershipData, templates.ownershipColumns),
  saveBookmark: function (params, fn) {
    var sql = templates.saveBookmark;
    this.connection.query(sql, [params.name, params.url, params.revision, params.type, new Date()], fn);
  },
  getBookmark: function (params, fn) {
    var sql = templates.getBookmark;
    this.connection.query(sql, [params.name, params.type], function (error, result) {
      if (error || !result) {
        return fn(error || { notfound: true });
      }
      fn(null, result);
    });
  },
  getAssetsForUser: function (username, fn) {
    this.connection.query(templates.getAssetsForUser, [username], fn);
  },
  deleteAsset: function (params, fn) {
    this.connection.query(templates.deleteAsset, [params.url, params.username], fn);
  },
  saveAsset: function (params, fn) {
    this.connection.query(templates.saveAsset, [
      params.username, params.url, params.size, params.mime
    ], fn);
  }
});


function updateMultipleFields(sqlTemplate, columnsArray) {
  return function (args, params, fn) {
    var values = [];
    var queries = Object.keys(params).map(function(key) {
      if (columnsArray.indexOf(key) === -1) {
        throw new Error('Warning: attempt to update sandbox table with invalid field "' + key + '"');
      }
      values.push(params[key]);
      return '`' + key + '`=?';
    });

    values = values.concat(args);

    var sql = sqlTemplate.replace('`:field`=?', queries.join(', '));

    this.connection.query(sql, values, fn);
  };
}
