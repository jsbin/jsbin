'use strict';
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
var store = null;

module.exports.createModels = function (_store) {
  if (_store) {
    store = _store;
  }
  var Model;
  var name;

  for (name in models) {
    if (models.hasOwnProperty(name)) {
      Model = models[name];

      // Convert ForgotTokenModel -> forgotToken
      name = name.slice(0, -5);
      name = name[0].toLowerCase() + name.slice(1);

      initialised[name] = new Model(store);
    }
  }

  return initialised;
};
