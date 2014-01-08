var models = require('../utils').index(__dirname, __filename);

// Create a new instance of each model and returns an object of name/Model
// pairs where name is the constructor name lowercased without the Model
// suffix.
//
// Example:
//
//   var models = createModels(store); //=> {user: {}, bin: {}}
//

var initialised = module.exports;

module.exports.createModels = function (store) {
  var Model, name;
  for (name in models) {
    if (models.hasOwnProperty(name)) {
      Model = models[name];

      // Convert ForgotTokenModel -> forgotToken
      name = name.slice(0, -5);
      name = name[0].toLowerCase() + name.slice(1);

      initialised[name] = new Model(store);
    }
  }

  // Clear the method and return cached result
  initialised.createModels = function() {
    console.log('Models have already been initialised');
    return initialised;
  };

  return initialised;
};
