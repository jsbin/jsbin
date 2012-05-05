var bin  = require('./bin'),
    user = require('./user');

module.exports.createModels = function (store) {
  return {
    bin: bin.create(store),
    user: user.create(store)
  };
};
