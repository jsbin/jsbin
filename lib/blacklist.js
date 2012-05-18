var blacklist = require('./config').blacklist || {};

module.exports.validate = function (bin) {
  var type, keywords, content, index, length;

  for (type in blacklist) {
    if (blacklist.hasOwnProperty(type)) {
      content  = bin[type] || '';
      keywords = blacklist[type] || [];

      for (index = 0, length = keywords.length; index < length; index += 1) {
        if (content.indexOf(keywords[index]) > -1) {
          return false;
        }
      }
    }
  }
  return true;
};
