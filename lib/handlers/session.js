var utils = require('../utils'),
    errors = require('../errors'),
    Observable = utils.Observable;

var passport       = require('passport'),
    GitHubStrategy = require('passport-github').Strategy;

module.exports = Observable.extend({
  constructor: function SessionHandler(sandbox) {
    Observable.apply(this, arguments);

    this.models = sandbox.models;
    this.mailer = sandbox.mailer;
    this.helpers = sandbox.helpers;

    var methods = Object.getOwnPropertyNames(SessionHandler.prototype).filter(function (prop) {
      return typeof this[prop] === 'function';
    }, this);

    utils.bindAll(this, methods);
  },
  loadUser: function (req, res, next) {
    this.models.user.load(req.param('name'), function (err, user) {
      if (err) {
        return next(err);
      }

      if (user) {
        req.user = user;
      }
      next();
    }.bind(this));
  },
  loadUserFromSession: function (req, res, next) {
    var name = req.session.user && req.session.user.name;

    function notAuthorized() {
      next(new errors.NotAuthorized());
    }

    if (!name) {
      return notAuthorized();
    }

    this.models.user.load(name, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        return notAuthorized();
      }

      req.user = user;
      next();
    });
  },
  loginUser: function (req, res, next) {
    var _this = this,
        model = this.models.user,
        user  = req.user,
        key   = req.param('key'),
        helpers = this.helpers;

    function failedLogin() {
      return _this.respond(req, res, 401, {
        ok: false,
        message: 'No dice I\'m afraid, those details didn\'t work.',
        step: '2.4'
      });
    }

    function onValidate(err, didPasswordMatch) {
      if (err) {
        return next(err);
      }
      if (!didPasswordMatch) {
        return failedLogin();
      }

      // Add the user data to the session.
      _this.setUserSession(req, user);

      // Update the login timestamp but don't wait for a response as it's
      // non crucial.
      model.touchLogin(user.name, function () {});

      _this.respond(req, res, 200, {
        ok: true,
        key: '',
        created: false
        // message: 'Now logged in as ' + user.name
      });
    }

    if (user) {
      if (user.created.getTime()) {
        model.valid(key, user.key, onValidate);
      } else {
        // No created timestamp so this is an old password. Validate it then
        // update it to use the new algorithm.
        if (model.validOldKey(key, user.key)) {
          model.upgradeKey(user.name, key, function (err) {
            onValidate(err, true);
          });
        } else {
          onValidate(null, false);
        }
      }
    } else {
      failedLogin();
    }
  },
  logoutUser: function (req, res, next) {
    delete req.session.user;
    res.flash(req.flash.NOTIFICATION, 'You\'re now logged out.');
    res.redirect(303, this.redirectUrl(req));
  },
  createUser: function (req, res, next) {
    var params = {
      name: req.param('name'),
      key: req.param('key'),
      email: req.param('email', '')
    }, _this = this;

    if (req.user) {
      return this.respond(req, res, 400, {
        ok: false,
        message: 'Too late I\'m afraid, that username is taken.',
        step: '2.3'
      });
    }

    if (!params.name || !params.key) {
      return this.respond(req, res, 400, {
        ok: false,
        message: 'Missing username or password',
        step: '2.3'
      });
    }

    this.models.user.create(params, function (err, id) {
      if (err) {
        return next(err);
      }

      // Add the user data to the session.
      _this.setUserSession(req, params);

      return _this.respond(req, res, 200, {ok: true, created: true});
    });
  },
  updateUser: function (req, res, next) {
    var helpers = this.helpers,
        requests = 0,
        user = req.user,
        email = req.param('email', '').trim(),
        key = req.param('key', '').trim(),
        _this = this;

    if ('name' in req.params && req.user.name !== req.param('name')) {
      return this.respond(req, res, 400, {
        ok: false,
        message: 'Sorry, changing your username isn\'t supported just yet. We\'re on it though!',
        step: '6'
      });
    }

    function onComplete(err) {
      if (err) {
        return next(err);
      }

      requests -= 1;
      if (requests === 0) {
        user.email = email;
        _this.setUserSession(req, user);

        _this.respond(req, res, 200, {
          ok: true,
          key: '',
          avatar: req.session.user.avatar,
          message: 'Account updated',
          created: false
        });
      }
    }

    if (email && email !== user.email) {
      requests += 1;
      this.models.user.updateEmail(user.name, email, onComplete);
    }

    if (key) {
      requests += 1;
      this.models.user.updateKey(user.name, key, onComplete);
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
        helpers = this.helpers,
        _this = this;

    if (!email) {
      res.statusCode = 400;
      res.json({error: 'Please provide a valid email address'});
      return;
    }

    this.models.user.loadByEmail(email, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        res.statusCode = 404;
        res.json({error: 'Unable to find a user for that email'});
        return;
      }

      _this.models.forgotToken.createToken(user.name, function (err, token) {
        if (err) {
          return next(err);
        }

        var ctx = {
          domain: helpers.set('url host').split(':')[0],
          link: helpers.url('reset?token=' + token, true)
        };

        // Send email.
        _this.mailer.forgotPassword(email, ctx, function (err, response) {
          var flash = 'An email has been sent to ' + email,
              type = req.flash.NOTIFICATION;

          if (err && err instanceof errors.MailerError) {
            type = req.flash.ERROR;
            if (_this.mailer.isEnabled()) {
              flash = 'Sorry, an error occurred when sending the reset email';
            } else {
              flash = 'Unable to send reset, email is not enabled in this version of JSBin';
            }
          } else if (err) {
            return next(err);
          }

          if (req.ajax) {
            res.json({});
          } else {
            res.flash(type, flash);
            res.redirect(303, helpers.url());
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
      return res.redirect(this.helpers.url());
    }

    this.models.forgotToken.loadUser(token, function (err, user) {
      if (err) {
        res.flash(req.flash.ERROR, 'Could not load user.');
        return res.redirect(303, _this.helpers.url());
      }

      if (!user) {
        return res.redirect(_this.helpers.url());
      }

      // Log the user in.
      _this.setUserSession(req, user);

      // Clear all their tokens.
      _this.models.forgotToken.expireTokensByUser(user.name, function () {});

      res.flash(req.flash.NOTIFICATION, 'You\'re now logged in, you can change your password in the account menu');
      res.redirect(303, _this.helpers.url());
    });
  },
  setUserSession: function (req, user) {
    req.session.user = {
      avatar: utils.gravatar(user.email),
      name: user.name,
      email: user.email,
      github_token: user.github_token,
      lastLogin: user.last_login || new Date()
    };
  },

  // Routes all post requests to /sethome which needs some serious discussion
  // as at the moment it uses the presence of params to determine which action
  // to call. It is consistent with the PHP app though.
  routeSetHome: function (req, res, next) {
    var params = utils.extract(req.body, 'name', 'key', 'email'),
        _this = this;

    this.loadUserFromSession(req, res, function (err) {
      if (!err) {
        // User was loaded from the session (they're logged in).
        _this.updateUser(req, res, next);
      } else if (err instanceof errors.NotAuthorized) {
        // This is a NotAuthorized error which means there is no session
        // so this user is not logged in. Now we can try and load the user
        // based on the "name" key.
        _this.loadUser(req, res, function (err) {
          if (err) {
            return next(err);
          }

          if ('email' in params) {
            // There's an email so this is a registration.
            _this.createUser(req, res, next);
          } else {
            // No email, this is a login.
            _this.loginUser(req, res, next);
          }
        });
      } else {
        return next(err);
      }
    });
  },
  respond: function (req, res, status, data) {
    if (res.ajax) return res.json(status, data);

    var type = status && status < 400 ? res.flash.INFO : res.flash.ERROR,
        redirect = type === req.flash.INFO ? this.redirectUrl(req) : 'back';
    res.flash(type, data.message);
    res.redirect(303, redirect);
  },
  redirectUrl: function (req, fallback) {
    var url = req.param('_redirect', fallback || 'back');
    // We only want to redirect to internal urls.
    if (url.indexOf('http') > -1) {
      url = 'home';
    }
    return url;
  },

  respondWithMessage: function (res, type, message) {
    res.flash(type, message);
    return res.redirect('/');
  },

  /**
   * Github Auth
   */

  /**
   * First part of GitHub auth. Uses the GitHub Strategy (passport-github, see
   * app.js) to do an OAuth2 exchange with GitHub.
   */
  github: [
    function (req, res, next) {
      req.session.referer = req.headers.referer;
      next();
    },
    passport.authenticate('github', { scope: ['user:email', 'gist'] })
  ],

  /**
   * Passport layer for the auth callback (/auth/github/callback). Does the
   * final token exchange
   */
  githubPassportCallback: passport.authenticate('github', {
    failureRedirect: '/'
  }),

  /**
   * Authentication through Github is complete, handle the authenticated user
   *  - Find user from GitHub id
        - Found?
          - Signed out
            - Sign in as found user
          - Signed in
            - JSBin ids match?
              - Weird case, sign in and allow through
            - JSBin ids don't match?
              - "Sorry, that GitHub account is linked to another JS Bin account."
        - Not found?
          - Signed out
            - Find by github name
              - Found?
                - "Please sign in to link accounts."
              - Not found?
                - Create user
          - Signed in
            - Save GitHub data to user account & session
   */
  githubCallback: function(req, res, next) {
    var githubUser = req.user,
        sessionUser = req.session.user;

    var redirect = req.session.referer || '/';

    // Find user from GitHub id
    this.models.user.getOne('getUserByGithubId', [githubUser.profile.id], function (err, jsbinUser) {
      if (err) return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, there was an error while accessing the database with your GitHub id (' + err + ')');
      // Was a user found?
      if (jsbinUser) {
        // Is the user signed in?
        if (sessionUser) {
          // Do the JS Bin ids match? (weird edge case where somebody links twice)
          if (jsbinUser.name === sessionUser.name) {
            // Sign in and allow through
            this.setUserSession(req, jsbinUser);
            return res.redirect(redirect);
          }
          // IDs did not match.
          res.flash(res.flash.ERROR, 'Sorry, that GitHub account is linked to another JS Bin account.');
          return res.redirect(redirect);
        }

        // User is not signed in
        // Sign them back in as the jsbin user, updating their token
        jsbinUser.github_token = githubUser.access_token;
        return this.models.user.updateGithubData(jsbinUser.name, jsbinUser.github_id, jsbinUser.github_token, function (err) {
          if (err) return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, could not update your GitHub data & sign you in (' + err + ')');
          // Add the user data to the session.
          this.setUserSession(req, jsbinUser);
          res.flash(res.flash.INFO, 'Welcome back.');
          return res.redirect(redirect);
        }.bind(this));
      }

      // Ok, no id matching JS Bin user was found.
      // Is the user signed in?
      if (sessionUser) {
        sessionUser.github_token = githubUser.access_token;
        sessionUser.github_id = githubUser.profile.id;
        // Hook the two users up
        return this.models.user.updateGithubData(sessionUser.name, sessionUser.github_id, sessionUser.github_token, function (err) {
          if (err) return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, could not connect your GitHub and JS Bin accounts (' + err + ')');
          // Add the user data to the session.
          this.setUserSession(req, sessionUser);
          res.flash(res.flash.NOTIFICATION, 'Your JS Bin account ('+sessionUser.name+') has been linked to your GitHub account ('+githubUser.profile.username+'). Nice.');
          return res.redirect(redirect);
        }.bind(this));
      }

      // No id matching user was found and the user is not signed in
      // Find by GitHub name
      this.models.user.load(githubUser.profile.username, function (err, jsbinUserFromGithubName) {
        if (err) return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, there was an error while accessing the database with your GitHub username (' + err + ')');
        // Was a name matching user found
        if (jsbinUserFromGithubName) {
          // Uh oh, that user exists already
          res.flash(res.flash.ERROR, 'Please sign in to link your GitHub account.');
          return res.redirect(redirect);
        }
        // No matching user was found, create an account!
        // Generate them a random password
        require('crypto').randomBytes(48, function(ex, buf) {
          var userData = {
            name: githubUser.profile.username,
            key: buf.toString('hex'),
            email: githubUser.profile.email || '',
            github_id: githubUser.profile.id,
            github_token: githubUser.access_token,
          };
          this.models.user.create(userData, function (err, id) {
            if (err) return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, there was an error while creating a new user (' + err + ')');
            // Add the user data to the session.
            this.setUserSession(req, userData);
            res.flash(res.flash.NOTIFICATION, 'Welcome to JS Bin, '+userData.name+'.');
            res.redirect(redirect);
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  // Handle custom errors raised by passport-github when recieving an invalid
  // code parameter to the callback url eg: /auth/github/callback?code=foo
  //
  // This will likely occur if a user refreshes or hits the back button on
  // an expired url. Here we handle it gracefully with a flash message and a
  // redirect back to the app.
  githubCallbackWithError: function (err, req, res, next) {
    // Handle errors raised by the passport-github module indicated by the
    // custom ouathError property. For the moment only handle 401 codes and
    // let others bubble up to the global handler.
    if (err.oauthError && err.oauthError.statusCode === 401) {
      return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, looks like that auth code has expired, please try and login again.');
    }
    next(err);
  }
});
