module.exports = require('../config.default.json');

function extend(target, object) {
  Object.getOwnPropertyNames(object).forEach(function (key) {
    var value = object[key];

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      extend(target[key], value);
    } else {
      target[key] = value;
    }
  });
  return target;
}

try {
  var local = require(process.env.JSBIN_CONFIG || '../config.local.json');
  extend(module.exports, local);
} catch (error) {}
