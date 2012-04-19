var mysql = require('mysql'),
    sql = require("./sql"),
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
    this.connection.query(sql.getBin, values, function (err, results, fields) {
      if (err || !results.length) {
        fn(!err && !results.length ? 'not-found' : err);
      }
      fn(null, results[0]);
    });
  },
  setBin: function () {
  },
  getLatestBin: function () {
  },
  getBinsByOwner: function (where) {
  },
  generateBinId: function () {
  }
};
