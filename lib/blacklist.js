'use strict';
var blacklist = require('./config').blacklist || {};

module.exports.validate = function (bin) {
  var okay = true;

  Object.keys(blacklist).forEach(function (type) {
    var content  = bin[type] || '';
    var keywords = blacklist[type] || [];

    if (okay) { // then keep checking
      okay = keywords.filter(function (keyword) {
        // return if found
        return content.indexOf(keyword) !== -1;
      }).length === 0;
    }
  });

  return okay;
};
