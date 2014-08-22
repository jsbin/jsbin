'use strict';
var blacklist = require('./config').blacklist || {};

module.exports.validate = function (bin) {
  var okay = true;

  ['html', 'javascript', 'css'].forEach(function (type) {
    var content  = bin[type] || '';
    var keywords = blacklist[type] || [];

    if (okay) { // then keep checking
      okay = keywords.filter(function (keyword) {
        // return if found
        return content.indexOf(keyword) !== -1;
      }).length === 0;
    }
  });

  // now test regexp
  if (blacklist.re) {
      ['html', 'javascript', 'css'].forEach(function (type) {
      var content  = bin[type] || '';

      if (okay) { // then keep checking
        okay = blacklist.re.filter(function (re) {
          // convert the string regexp to a real reggie expession.
          var reg = new RegExp(re, 'mi');
          // return if found
          return content.match(reg) !== null;
        }).length === 0;
      }
    });
  }

  return okay;
};
