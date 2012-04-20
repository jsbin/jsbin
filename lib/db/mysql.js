var mysql = require('mysql'),
    sql = require("./sql_templates"),
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
    this.connection.query(sql.getBin, values, function (err, results) {
      if (err || !results.length) {
        return fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, results[0]);
    });
  },
  setBin: function () {
  },
  getLatestBin: function (params, fn) {
    var values = [params.id];
    this.connection.query(sql.getLatestBin, values, function (err, results) {
      if (err || !results.length) {
        return fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, results[0]);
    });
  },
  getBinsByOwner: function (where) {
  },
  generateBinId: function () {
  }
};
