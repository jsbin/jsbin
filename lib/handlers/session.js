var utils = require('../utils'),
    errors = require('../errors'),
    Observable = utils.Observable;

module.exports = Observable.extend({
  constructor: function SessionHandler() {
    Observable.apply(this, arguments);

    var methods = Object.getOwnPropertyNames(SessionHandler.prototype).filter(function (prop) {
      return typeof this[prop] === 'function';
    }, this);

    utils.bindAll(this, methods);
  },
  loadUser: function (req, res, next) {
    req.models.user.load(req.param('name'), function (err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        req.user = user;
      }
      next();
    });
  },
  loadUserFromSession: function (req, res, next) {
    var name = req.session.user && req.session.user.name;

    req.models.user.load(name, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new errors.NotAuthorized());
      }

      req.user = user;
      next();
    });
  },
  loginUser: function (req, res, next) {
    var model = req.models.user,
        user  = req.user,
        key   = req.param('key');

    function onValidate(err, same) {
      if (err) {
        return next(err);
      }
      if (!same) {
        return res.json(401, {ok: false});
      }

      // Add the user data to the session.
      req.session.user = {
        name: user.name,
        lastLogin: user.last_login
      };

      // Update the login timestamp but don't wait for a response as it's
      // non crucial.
      model.touchLogin(user.name, function () {});

      if (req.ajax) {
        res.json(200, {ok: true, key: '', created: false});
      } else {
        res.redirect(303, req.helpers.url(user.name));
      }
    }

    if (user) {
      if (user.created.getTime()) {
        model.valid(key, user.key, onValidate);
      } else {
        // No created timestamp so this is an old password. Validate it then
        // update it to use the new algorithm.
        if (model.validOldKey(key, user.key)) {
          model.updateKey(user, key, function (err) {
            onValidate(err, true);
          });
        } else {
          onValidate(null, false);
        }
      }
    } else {
      next();
    }
  },
  logoutUser: function (req, res, next) {
    delete req.session.user;
    res.redirect(303, req.param('_redirect', req.helpers.url('')));
  },
  createUser: function (req, res, next) {
    var params = {
      name: req.param('name'),
      key: req.param('key'),
      email: req.param('email', '')
    }, _this = this;

    if (!params.name || !params.key) {
      return res.json(400, {ok: false, error: 'Missing username or password'});
    }

    req.models.user.create(params, function (err, id) {
      if (err) {
        return next(err);
      }

      // Add the user data to the session.
      _this.setUserSession(req, params);

      if (req.ajax) {
        res.json(200, {ok: true, key: '', created: true});
      } else {
        res.redirect(303, req.helpers.url(params.name));
      }
    });
  },
  updateUser: function (req, res, next) {
    var requests = 0,
        user = req.user,
        email = req.param('email', '').trim(),
        key = req.param('key', '').trim();

    function onComplete(err) {
      if (err) {
        return next(err);
      }

      requests -= 1;
      if (requests === 0) {
        if (req.ajax) {
          res.json(200, {ok: true, key: '', created: false});
        } else {
          res.redirect(303, req.helpers.url());
        }
      }
    }

    if (email && email !== user.email) {
      requests += 1;
      req.models.user.updateEmail(user.name, email, onComplete);
    }

    if (key) {
      requests += 1;
      req.models.user.updateKey(user.name, key, onComplete);
    }

    // Just return if nothing to update.
    if (requests === 0) {
      requests = 1;
      onComplete();
    }
  },
  requestToken: function (req, res, next) {
    res.render('request', {
      action: req.originalUrl,
      csrf: req.session._csrf
    });
  },
  // Generates a token to allow the user to reset their password.
  forgotPassword: function (req, res, next) {
    // Verify email.
    var email = req.param('email', '').trim(),
        _this = this;

    if (!email) {
      res.statusCode = 400;
      res.json({error: 'Please provide a valid email address'});
      return;
    }

    req.models.user.loadByEmail(email, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        res.statusCode = 404;
        res.json({error: 'Unable to find a user for that email'});
        return;
      }

      req.models.forgotToken.createToken(user.name, function (err, token) {
        if (err) {
          return next(err);
        }

        var ctx = {
          domain: req.helpers.set('url host').split(':')[0],
          link: req.helpers.url('reset?token=' + token, true)
        };

        // Send email.
        req.mailer.forgotPassword(email, ctx, function (err, response) {
          if (err) {
            return next(err);
          }

          if (req.ajax) {
            res.json({});
          } else {
            res.redirect(303, req.helpers.url());
          }
        });
      });
    });
  },
  resetPassword: function (req, res, next) {
    // Validate the token.
    var token = req.param('token', '').trim(),
        _this = this;

    if (!token) {
      // Nope.
      return res.redirect(req.helpers.url());
    }

    req.models.forgotToken.loadUser(token, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.redirect(req.helpers.url());
      }

      // Log the user in.
      _this.setUserSession(req, user);

      // Clear all their tokens.
      req.models.forgotToken.expireTokensByUser(user.name, function () {});

      res.render('account', {
        email: user.email,
        action: req.helpers.url('updatehome'),
        csrf: req.session._csrf
      });
    });
  },
  setUserSession: function (req, user) {
    req.session.user = {
      name: user.name,
      lastLogin: new Date()
    };
  }
});
