module.exports = require('../config.default.json');

try {
  var local = require(process.env.JSBIN_CONFIG || '../config.local.json');
  Object.getOwnPropertyNames(local).forEach(function (key) {
    exports[key] = local[key];
  });
} catch (error) {}
