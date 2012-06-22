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
          model.updateKey(user.name, key, function (err) {
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

      req.models.forgotToken.createToken(user.name, function (err, result) {
        if (err) {
          return next(err);
        }

        // Send email.
        return res.json({});
      });
    });
  },
  // Updates the users password.
  updatePassword: function (req, res, next) {
    // Update users password.
    // Redirect to root.
    res.redirect(req.helpers.url());
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

      res.render('reset', {
        action: req.originalUrl,
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
