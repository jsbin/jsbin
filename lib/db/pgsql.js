'use strict';
var pgsql = require('pg'),
    templates = require('./pgsql_templates'),
    utils = require('../utils');

module.exports = utils.inherit(Object, {
  defaults: null,
  constructor: function PgSQL(options) {
    this.options    = options;
    this.defaults   = {html: '', css: '', javascript: ''};
    //this.connection = mysql.createPool(options);
    this.pool = new pg.Pool(config);
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
      sql =templates.getBin,
        _this = this;
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }
          if (result.length > 1) {
            result[0].latest = false;
          }

          fn(null, result[0] && _this.applyBinDefaults(result[0]));
        });
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

    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err || !result.affectedRows) {
            return fn(err);
          }
          fn(null, result.insertId);
      });
    });
  },
  setBinOwner: function (params, fn) {
    var sql = templates.setBinOwner,
        values = [params.name, params.url, params.revision, new Date(), params.summary, params.html, params.css, params.javascript, params.visibility || 'public'];

    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    // TODO: Re-factor common callbacks into helpers.
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err || !result.affectedRows) {
            return fn(err);
          }
          fn(null, result.insertId);
      });
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
      console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
      this.pool.connect(function(err, client, done) {
          if(err) {
            return console.error('error fetching client from pool', err);
          }
          client.query(sql, values, function (err, result) {
                done();
                if (err || !result.affectedRows) {
                  return fn(err || 'no-entry');
                }
                fn(null, result.insertId);
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
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }
          fn(null, result[0] && _this.applyBinDefaults(result[0]));
        });
    });
  },
  getLatestBinForUser: function (id, n, fn) {
    var sql = templates.getLatestBinForUser,
        //query = this.connection.query.bind(this.connection),
        _this = this;
    var values = [id, n];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }

          // i.e. if they've never saved anything before
          if (result.length === 0) {
            return fn(null, null);
          }

          _this.getBin({ id: result[0].url, revision: result[0].revision }, fn);
        });
    });
  },
  getBinsByUser: function (id, fn) {
    var sql = templates.getBinsByUser,
        //query = this.connection.query.bind(this.connection),
        _this = this;
    var values = [id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }

          var collected = [];

          // i.e. if they've never saved anything before
          result.forEach(function (result) {
            collected.push(_this.applyBinDefaults(result));
          });
          fn(null, collected);
      });
    });
  },
  // Get all bins from the owners field
  getAllOwners: function (fn) {
    var sql = templates.getAllOwners;
    // Get all the 'owned' bins
    var values = [];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
        done();
        fn();
      });
    });
  },
  getOwnersBlock: function (start, size, fn) {
    var sql = templates.getOwnersBlock;
    // Get all the 'owned' bins
    var values = [start, size];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
        done();
        fn();
      });
    });
  },
  generateBinId: function (length, attempts, fn) {
    attempts = attempts || 1;
    var pgsql = this;

    function tryurl(triesLeft, fn) {
      if (triesLeft === 0) {
        return fn(null, null);
      }

      console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
      var id = utils.shortcode(length + attempts);
      pgsql.connection.query(templates.binExists, [id], function (err, result) {
        if (err) {
          fn(err);
        } else if (result.length) {
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
          pgsql.generateBinId(length, attempts + 1, fn);
        }
      });
    } else {
      fn(new Error('too-many-tries'));
    }
  },
  archiveBin: function (bin, fn) {
    var values = [bin.archive, bin.name, bin.url, bin.revision],
        sql = templates.archiveBin;
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err || !result.affectedRows) {
            return fn(err);
          }
          fn(null, result);
      });
    });

  },
  deleteUser: function (id, fn) {
    var sql = templates.deleteUser, 
        values = [id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result){
        done();
        fn();
      });
    });
  },
  getUser: function (id, fn, usernameOnly) {
    var _this = this,
    values = [id],
    sql = templates.getUser;
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          if (err) {
            done();
            return fn(err);
          } else if (result.length === 0 && !usernameOnly) {
            sql = templates.getUserByEmail;
            console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
            client.query(sql, values, function (err, result) {
              done();
              if (err) {
                return fn(err);
              }

              fn(null, result[0]);
            });
          } else {
            fn(null, result[0]);
          }
        });
    });
  },
  getUserByApiKey: function (apiKey, fn) {
    var sql = templates.getUserByApiKey,
        values = [apiKey];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }
          fn(null, result[0]);
        });
    });
  },
  getUserByEmail: function (email, fn) {
    var sql = templates.getUserByEmail,
    values = [email];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }
          fn(null, result[0]);
      });
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
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err || !result.affectedRows) {
            return fn(err);
          }
          fn(null, result.insertId);
      });
    });
  },
  touchOwners: function (params, fn) {
    // params.date is only for use when populating the summary field
    var sql =templates.touchOwners;
    var values = [params.date || new Date(), params.name, params.url, params.revision];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err || !result.affectedRows) {
            return fn(err);
          }

          if (typeof fn === 'function') {
            fn(null, result.insertId);
          }
      });
    });
  },
  updateOwners: function (params, fn) {
    // params.date is only for use when populating the summary field
    var values = [params.date || new Date(), params.summary, params.panel_open, params.name, params.url, params.revision]; //jshint ignore:line

    var panel = params.panel,
        allowed = {html: 1, css: 1, javascript: 1},
        sql = templates.updateOwners.replace(':panel', panel);

    if (allowed[panel]) {
      console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
      this.pool.connect(function(err, client, done) {
        if(err) {
          return console.error('error fetching client from pool', err);
        }
        client.query(sql, values, function (err, result) {
              done();
              if (err || !result.affectedRows) {
                return fn(err);
              }

              if (typeof fn === 'function') {
                fn(null, result.insertId);
              }
        });
      });
    } else {
      fn('invalid-panel');
    }
  },
  populateOwners: function (params, fn) {
    var sql = templates.populateOwners;
    // params.date is only for use when populating the summary field
    var values = [params.date || new Date(), params.summary, params.html, params.css, params.javascript, params.name, params.url, params.revision];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err || !result.affectedRows) {
            return fn(err);
          }

          if (typeof fn === 'function') {
            fn(null, result.insertId);
          }
      });
    });
  },
  touchLogin: function (id, fn) {
    var sql = templates.touchLogin;
    var now = new Date();
    var values = [now, id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  updateUserEmail: function (id, email, fn) {
    var sql = templates.updateUserEmail;
    var now = new Date();
    var values = [email, now, id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  updateUserSettings: function(id, settings, fn) {
    var sql = templates.updateUserSettings;
    var values=[JSON.stringify(settings), id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  updateUserGithubData: function (id, ghId, token, fn) {
    var sql = templates.updateUserGithubData;
    var now = new Date();
    var values = [ghId, token, now, id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  updateUserDropboxData: function (id, token, fn) {
    var sql = templates.updateUserDropboxData;
    var now = new Date();
    var values = [token, now, id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  updateUserKey: function (id, key, fn) {
    var sql = templates.updateUserKey;
    var now = new Date();
    var values = [key, now, id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  // Different to updateUserKey() in that it also sets the created timestamp
  // which is required to differentiate between a JSBin 2 user and a new
  // one.
  upgradeUserKey: function (id, key, fn) {
    var sql = templates.upgradeUserKey;
    var now = new Date();
    var values = [key, now, now, id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  getUserByForgotToken: function (token, fn) {
    var sql = templates.getUserForForgotToken;
    var values = [token, new Date()];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }
          fn(null, result[0]);
      });
    });
  },
  setForgotToken: function (user, token, fn) {
    var sql = templates.setForgotToken,
        expires = this.expireDate();

    var values = [user, token, expires, new Date()];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }
          fn(null, result.insertId);
      });
    });
  },
  expireForgotToken: function (token, fn) {
    var sql = templates.deleteExpiredForgotToken;

    // Allow all old tokens to be expired with same call.
    if (typeof token === 'function') {
      fn = token;
      token = null;
    }
    var values = [new Date(), token, null];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  expireForgotTokenByUser: function (user, fn) {
    var sql = templates.deleteExpiredForgotToken;
    var values = [new Date(), null, user];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
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
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  isOwnerOf: function (params, fn) {
    var values = [
      params.name,
      params.url
    ], sql = templates.isOwnerOf;
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }
          fn(null, { found: !!result.length, isowner: result.length ? result[0].owner === 1 : false, result: result[0] });
      });
    });
  },
  getUserBinCount: function (id, fn) {
    var values = [id],
        sql = templates.getUserBinCount;
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            return fn(err);
          }
          fn(null, { found: !!result.length, total: result.length ? result[0].total : 0 });
      });
    });
  },
    // getOne('<sql template>', [constraint1, constraint2, ...], fn)
  getOne: function (queryKey, values, fn) {
    var sql = templates[queryKey];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err) {
            fn(err, null);
          } else {
            fn(null, result.length ? result[0] : null);
          }
      });
    });
  },
  getBinMetadata: function(bin, fn) {
    var sql = templates.getBinMetadata;
    var values = [bin.url, bin.revision];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) {
          done();
          if (err) {
            return fn(err);
          }
          fn(null, (result && result.length > 0 && result[0]) ? result[0] : {
            visibility: 'public',
            name: 'anonymous'
          });
      });
    });
  },
  setBinVisibility: function(bin, name, value, fn) {
    var sql = templates.setBinVisibility, values = [
      value, name, bin.url
    ];
    if (!bin.metadata || bin.metadata.name !== name) {
      return fn(401);
    }
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) {
          done();
          if (err) {
            return fn(500);
          }
          fn(err, result);
      });
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
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (err, result) {
          done();
          if (err || !result.affectedRows) {
            return fn(err || new Error('unable to set customer'));
          }
          fn(null, result);
      });
    });
  },
  setCustomerActive: function (user, active, fn) {
    var sql = templates.setCustomerActive;
    var values = [active, user];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  getCustomerByStripeId: function(id, fn) {
    var sql = templates.getCustomerByStripeId;
    var values = [id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  getUserListing: function (user, fn) {
    var sql = templates.userListing;
    var values = [user];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  getCustomerByUser: function(user, fn) {
    var sql = templates.getCustomerByUser;
    var values = [user.name];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) {
          done();
          if (err || !result) {
            return fn(err || new Error('unable to find customer'));
          }
          fn(null, result);
      });
    });
  },
  setProAccount: function(id, pro, fn) {
    var sql = templates.setProAccount;
    var values = [pro, new Date(), id];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  updateBinData: updateMultipleFields(templates.updateBinData, templates.sandboxColumns),
  updateOwnersData: updateMultipleFields(templates.updateOwnersData, templates.ownersColumns),
  updateOwnershipData: updateMultipleFields(templates.updateOwnershipData, templates.ownershipColumns),
  saveBookmark: function (params, fn) {
    var sql = templates.saveBookmark;
    var values = [params.name, params.url, params.revision, params.type, new Date()];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  getBookmark: function (params, fn) {
    var sql = templates.getBookmark;
    var values = [params.name, params.type];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function (error, result) {
          done();
          if (error || !result) {
            return fn(error || { notfound: true });
          }
          fn(null, result);
      });
    });
  },
  getAssetsForUser: function (username, fn) {
    var sql = templates.getAssetsForUser;
    var values = [username];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  deleteAsset: function (params, fn) {
    var sql = templates.deleteAsset;
    var values = [params.url, params.username];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  },
  saveAsset: function (params, fn) {
    var sql = templates.saveAsset;
    var values = [
      params.username, params.url, params.size, params.mime
    ];
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
    this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
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
    console.log("pgsql:" + arguments.callee.name + "sql:" + sql + "values:"+ values);
   this.pool.connect(function(err, client, done) {
      if(err) {
        return console.error('error fetching client from pool', err);
      }
      client.query(sql, values, function(err, result) { done(); fn(); });
    });
  };
}
