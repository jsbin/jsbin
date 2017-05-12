const onHeaders = require('on-headers');
const clone = require('lodash').cloneDeep;

module.exports = function (blacklist) {
  if (blacklist && !Array.isArray(blacklist)) {
    blacklist = [blacklist];
  }
  return function (req, res, next) {
    onHeaders(res, function () {
      res.locals._sessionBeforeBlacklist = clone(req.session);
      if (blacklist) {
        blacklist.forEach(key => deleteItem(req.session, key));
      }
    });
    next();
  };
};

function deleteItem(object = {}, key) {
  const keys = key.split('.');
  const last = keys.length - 1;
  return keys.reduce((obj, key, i) => {
    if (i === last && obj[key] !== undefined) {
      delete obj[key];
    }
    return obj[key] || {};
  }, object);
};
