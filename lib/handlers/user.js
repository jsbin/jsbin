'use strict';
var utils = require('../utils'),
    Observable = utils.Observable,
    userModel;

module.exports = Observable.extend({
  constructor: function UserHandler(sandbox) {
    Observable.apply(this, arguments);

    this.models = sandbox.models;
    userModel = sandbox.models.user;
    this.mailer = sandbox.mailer;
    this.helpers = sandbox.helpers;

  },

  validateRegister: function (req, res, next) {
    var username  = req.param('username');
    var email = req.param('email');
    var key = req.param('key');
    var missingValues = [];
    var user = {
      name: username,
      email: email,
      key: key
    };

    if (!username || !key || !email) {
      for (var param in user) {
        if (!user[param]) {
          missingValues.push(param);
        }
      }

      req.error = 'Missing values for ' + missingValues.reduce(function(str, val, i, arr){
        return str += val + (i < arr.length -1 ? ', ' : '.');
      }, '');

      // Not enough details
      return next();
    }

    userModel.load(username, function (err, result) {
      if (result) {
        req.error = 'Username taken';
        return next();
      }

      userModel.create(user, function (err) {
        if (err) {
          return next(err);
        }
        req.validatedUser = user;
        next();
      });
    });
  },

  validateLogin: function (req, res, next) {
    var username  = req.param('username');
    var key = req.param('key');

    userModel.load(username, function (err, user) {

      var validationComplete = function(err, validated){
        if (validated) {
          req.validatedUser = user;
        } else {
          req.error = 'Wrong password';
        }
        return next();
      };

      if (err || !user) {
        req.error = 'No such user';
        return next();
      }

      if (user.created && user.created.getTime()) {
        userModel.valid(key, user.key, validationComplete);
      } else {
        // No created timestamp so this is an old password. Validate it then
        // update it to use the new algorithm.
        userModel.validOldKey(key, user.key, function(err, valid) {
          validationComplete = validationComplete.bind(null, err , valid);

          if (err || !valid) {
            return validationComplete();
          }

          // note that validationComplete is called with original `err, valid`
          // arguments that are part of *this* closure.
          userModel.upgradeKey(user.name, key, validationComplete);
        });

      }

    });

  }

});
