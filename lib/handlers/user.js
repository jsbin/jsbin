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

      missingValues = missingValues.reduce(function(str, val, i, arr){
          return str += val + (i < arr.length -1 ? ', ' : '.');
        }, '');

      req.error = {
        ok: false,
        message: 'Missing username or password',
        raw: 'Missing values for ' + missingValues,
        status: 400
      };

      // Not enough details
      return next();
    }

    userModel.load(username, function (err, result) {
      if (result) {
        // Username taken
        req.error = {
          ok: false,
          message: 'Too late I\'m afraid, that username is taken.',
          status: 400
        };
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
          req.error = {
            ok: false,
            message: 'No dice I\'m afraid, those details didn\'t work.',
            status: 401
          };
        }
        return next();
      };

      if (err || !user) {
        // we're returning failed details, but not indicating whether it's
        // username or password - this is on purpose.
        req.error = {
          ok: false,
          message: 'No dice I\'m afraid, those details didn\'t work.',
          status: 400
        };
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
