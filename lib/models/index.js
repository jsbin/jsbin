var models = require('../utils').index(__dirname, __filename);

// Create a new instance of each model and returns an object of name/Model
// pairs where name is the constructor name lowercased without the Model
// suffix.
//
// Example:
//
//   var models = createModels(store); //=> {user: {}, bin: {}}
module.exports.createModels = function (store) {
  var initialized = {}, Model, name;
  for (name in models) {
    if (models.hasOwnProperty(name)) {
      Model = models[name];
      initialized[name.slice(0, -5).toLowerCase()] = new Model(store);
    }
  }
  return initialized;
};
