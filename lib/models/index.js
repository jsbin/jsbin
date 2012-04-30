var bin = require('./bin');

module.exports.createModels = function (store) {
  return {
    bin: bin.create(store)
  };
};
