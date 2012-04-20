var mysql = require('mysql'),
    templates = require("./sql_templates"),
    utils = require('../utils'),
    MySQL;

MySQL = module.exports = function MySQL(options) {
  this.connection = mysql.createClient(options);
};

MySQL.prototype = {
  constructor: MySQL,
  connect: function (fn) {
    this.connection.useDatabase(this.connection.database, fn);
  },
  disconnect: function (fn) {
    this.connection.end(fn);
  },
  getBin: function (params, fn) {
    var values = [params.id, params.revision];
    this.connection.query(templates.getBin, values, function (err, results) {
      if (err || !results.length) {
        return fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, results[0]);
    });
  },
  setBin: function (params, fn) {
    var values = [
      params.javascript,
      params.css,
      params.html,
      params.url,
      params.revision,
      params.streamingKey
    ], sql = templates.setBin;

    this.connection.query(sql, values, function (err, result) {
      if (err || !result.affectedRow) {
        return fn(err);
      }
      fn(null, result.insertId);
    });
  },
  getLatestBin: function (params, fn) {
    var values = [params.id],
        sql = templates.getLatestBin;

    this.connection.query(sql, values, function (err, results) {
      if (err || !results.length) {
        return fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, results[0]);
    });
  },
  getBinsByOwner: function (where) {
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
  }
};
