'use strict';
var utils = require('../utils');
var features = require('../features');
var validator = require('validator');
var custom = require('../custom');
var Observable = utils.Observable;
var userModel;

module.exports = Observable.extend({
  constructor: function UserHandler(sandbox) {
    Observable.apply(this, arguments);

    this.models = sandbox.models;
    userModel = sandbox.models.user;
    this.mailer = sandbox.mailer;
    this.helpers = sandbox.helpers;

  },

  updateLastSeen: function (req, res, next) {
    if (req.session.user) {
      // just touch the last_seen field
      userModel.updateOwnershipData(req.session.user.name, {
        last_seen: new Date() // jshint ignore:line
      }, function () {});
    }
    next();
  },

  saveVanityURL: function (req, res) {
    userModel.saveBookmark(req.session.user, req.bin, 'vanity', function (err) {
      if (err) {
        return res.send(500, err);
      }
      res.send({ ok: true });
    });
  },

  loadVanityURL: function (req, res, next) {
    if (req.subdomain) {
      if (custom[req.subdomain]) {
        return next('route');
      }
      // test if this is a user with vanity feature
      userModel.load(req.subdomain, function (error, user) {
        if (error) {
          console.log('error loading %s', req.url, error);
          return next('route');
        }

        if (features('vanity', { session: { user: user }})) {
          // do magic
          userModel.getBookmark(user, 'vanity', function (err, data) {
            if (err || data.length === 0) {
              if (err) {
                console.error(err);
              }
              return res.redirect(req.app.get('url full'));
            }

            req.params.rev = data[0].revision;
            req.params.bin = data[0].url;

            req.params.quiet = 'quiet';
            res.locals.vanity = true;
            next();
          });
        } else {
          return res.redirect(req.app.get('url full'));
        }
      }.bind(this));
    } else {
      next('route');
    }
  },

  validateRegister: function (req, res, next) {
    var username  = req.param('username');
    var email = req.param('email').trim();
    var key = req.param('key');
    var flagged = req.param('flagged') || false;
    var missingValues = [];
    var user = {
      name: username,
      email: email,
      flagged: flagged,
      key: key,
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

    var reg = /^[a-zA-Z0-9_\-]+$/;
    if (!reg.test(username)) {
      req.error = {
        ok: false,
        message: 'Only numbers, letters, underscore and dash are allowed in the username.',
        raw: 'Character not allowed',
        status: 400
      };

      return next();
    }

    if (!validator.isEmail(email)) {
      req.error = {
        ok: false,
        message: 'Your email address doesn\'t look valid. Please try again.',
        raw: 'Invalid email',
        status: 400
      };

      return next();
    }

    if (req.app.settings.reserved.indexOf(username) !== -1) {
      req.error = {
        ok: false,
        message: 'Too late I\'m afraid, that username is taken.',
        status: 400
      };

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

      userModel.create(user, function (err, id) {
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

      if (user.created && !!user.created.getTime) {//()) {
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
