'use strict';
var utils = require('../utils'),
    features = require('../features'),
    Observable = utils.Observable,
    Promise = require('rsvp').Promise,
    userModel;

module.exports = Observable.extend({
  constructor: function UserHandler(sandbox) {
    Observable.apply(this, arguments);

    this.models = sandbox.models;
    userModel = sandbox.models.user;
    this.mailer = sandbox.mailer;
    this.helpers = sandbox.helpers;
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
    // if we're not on a subdomain and we're on jsbin.com - continue
    if (!req.subdomain && req.app.settings['url host'] === req.headers.host) {
      return next('route');
    }
    new Promise(function (resolve, reject) {
      var dbReturn = function (error, data) {
        if (error || !data || data.length === 0) {
          return reject(error || 'nothing found');
        }
        resolve(data[0]);
      };

      if (req.subdomain) {
        userModel.load(req.subdomain, dbReturn);
      } else if (req.app.settings['url host'] !== req.headers.host) {
        userModel.loadByDomain(req.headers.host, dbReturn);
      } else {
        reject('no domain - simple');
      }
    }).then(function (user) {
      return new Promise(function (resolve, reject) {
        console.log(user, features('vanity', { session: { user: user }}));
        if (features('vanity', { session: { user: user }})) {
          // do magic
          userModel.getBookmark(user, 'vanity', function (err, data) {
            if (err || data.length === 0) {
              if (err) {
                console.error(err);
              }
              // don't reject becase this is a special case
              return res.redirect(req.app.get('url full'));
            }

            req.params.rev = data[0].revision;
            req.params.bin = data[0].url;

            req.params.quiet = 'quiet';
            next();
          });
        } else {
          reject('user does not have access to vanity feature');
        }
      });
    }).catch(function (error) {

      next('route');
    });
    // if (req.subdomain) {
    //   // test if this is a user with vanity feature
    //   userModel.load(req.subdomain, function (error, user) {
    //     if (error) {
    //       return next('route');
    //     }

    //     if (features('vanity', { session: { user: user }})) {
    //       // do magic
    //       userModel.getBookmark(user, 'vanity', function (err, data) {
    //         if (err || data.length === 0) {
    //           if (err) {
    //             console.error(err);
    //           }
    //           return res.redirect(req.app.get('url full'));
    //         }

    //         req.params.rev = data[0].revision;
    //         req.params.bin = data[0].url;

    //         req.params.quiet = 'quiet';
    //         next();
    //       });
    //     } else {
    //       return next('route');
    //     }
    //   }.bind(this));
    // } else {
    //   next('route');
    // }
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

    var reg = /^[a-zA-Z0-9_\-]+$/;
    if (!reg.test(username)) {
      req.error = {
        ok: false,
        message: 'Only numbers, letters, underscore and dash are allowed in the username',
        raw: 'Character not allowed',
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
