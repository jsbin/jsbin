'use strict';
/**
 *  request.user vs request.session.user
 *  request.user is populated by middleware is is the result of a db query based on a user id/name
 *  request.session.user is the current logged in user
*/
var utils = require('../utils');
var errors = require('../errors');
var Observable = utils.Observable;
var passport = require('passport');
var sendy = require('../addons/sendy');
var clone = require('clone');
var Promise = require('promise');


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
    this.models.user.load(req.param('username'), function (err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        req.user = user;
        next();
      } else {
        next('User not found for ' + req.param('username'));
      }
    });
  },
  setProAccount: function(req, res){
    var setPro = true;
    this.models.user.setProAccount(req.session.user.name, setPro, function(){
      var user = req.session.user;
      user.pro = setPro;
      this.setUserSession(req, user);
      res.redirect('/');
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
    var model = this.models.user;
    var user = req.validatedUser;

    if (!req.error) {
      this.setUserSession(req, user);
      // Update the login timestamp but don't wait for a response as it's
      // non crucial.
      model.touchLogin(user.name, function () {});
    }

    next();
  },
  redirectUserAfterLogin: function (req, res) {
    var user = req.validatedUser;
    var referrer = req.session.referer || req.param('referrer');
    if (req.ajax) {
      if(req.error) {
        res.json(400, req.error);
      } else {

        res.json(200, {
          referrer: (referrer || ''),
          user: user
        });
      }
    } else {
      if (req.error) {
        return res.redirect('back');
      }
      res.redirect(referrer);
    }
  },
  logoutUser: function (req, res) {
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

    this.models.user.create(params, function (err) {
      if (err) {
        return next(err);
      }

      // Add the user data to the session.
      _this.setUserSession(req, params);

      return _this.respond(req, res, 200, {ok: true, created: true});
    });
  },
  updateUser: function (req, res, next) {
    var requests = 0,
        user = req.user,
        email = req.param('email', '').trim(),
        key = req.param('key', '').trim(),
        beta = req.param('beta') == "true",
        session = this;

    if ('name' in req.params && req.user.name !== req.param('name')) {
      return this.respond(req, res, 400, {
        ok: false,
        message: 'Sorry, changing your username isn\'t supported just yet. We\'re on it though!',
        step: '6'
      });
    }

    var subscribed = req.param('subscribed');
    if (subscribed !== undefined) {
      subscribed = subscribed === 'true' ? true : false;
      sendy.setSubscribed({
        name: req.user.name,
        email: email,
        id: req.user.id
      }, !!subscribed);
    }

    // make promises out of these functions
    var updateOwnershipData = Promise.denodeify(session.models.user.updateOwnershipData).bind(session.models.user);
    var updateKey = Promise.denodeify(session.models.user.updateKey).bind(session.models.user);

    var promises = [];

    promises.push(updateOwnershipData(user.name, {
      email: email,
      beta: beta,
    }));

    if (key) {
      promises.push(updateKey(user.name, key));
    }

    Promise.all(promises).then(function () {
      user.email = email;
      user.beta = beta;
      session.setUserSession(req, user);

      session.respond(req, res, 200, {
        ok: true,
        key: '',
        avatar: req.session.user.avatar,
        message: 'Account updated',
        created: false
      });
    }).catch(function (error) {
      next(error);
    });

  },
  requestToken: function (req, res) {
    res.render('request', {
      action: req.originalUrl,
      csrf: req.session._csrf
    });
  },
  // Generates a token to allow the user to reset their password.
  forgotPassword: function (req, res, next) {
    // Verify email.
    var usernameOrEmailAddress = req.param('email', '').trim(),
        helpers = this.helpers,
        sessionHandler = this;

    if (!usernameOrEmailAddress) {
      res.statusCode = 400;
      res.json({error: 'Either a username or email address is required to send a password reset token.'});
      return;
    }

    var createToken = function createToken(user) {
      this.models.forgotToken.createToken(user.name, function (err, token) {
        if (err) {
          return next(err);
        }

        var ctx = {
          domain: helpers.set('url host').split(':')[0],
          link: helpers.url('reset?token=' + token, true)
        };

        // Send email.
        sessionHandler.mailer.forgotPassword(user.email, ctx, function (err) {
          var flash = 'An email has been sent to ' + user.email,
              type = req.flash.NOTIFICATION;

          if (err && err instanceof errors.MailerError) {
            type = req.flash.ERROR;
            if (sessionHandler.mailer.isEnabled()) {
              flash = 'Sorry, an error occurred when sending the reset email: ' + err;
            } else {
              flash = 'Unable to send reset, email is not enabled in this version of JS Bin.';
            }
          } else if (err) {
            return next(err);
          }

          if (req.ajax) {
            res.json({ message: flash });
          } else {
            res.flash(type, flash);
            res.redirect(303, helpers.url());
          }
        });
      });
    }.bind(this);

    var noUserFound = function () {
      res.statusCode = 404;
      res.json({error: 'I looked, but I couldn\'t find any user with those details. Sorry!'});
    };

    // try loading by username first
    this.models.user.load(usernameOrEmailAddress, function (err, user) {
      if (err) {
        return next(err);
      }

      if (!user) {
        // try by email next
        this.models.user.loadByEmail(usernameOrEmailAddress, function (err, user) {
          if (!user) {
            return noUserFound();
          } else {
            createToken(user);
          }
        });
      } else {
        createToken(user);
      }
    }.bind(this));
  },
  resetPassword: function (req, res) {
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

      res.flash(req.flash.NOTIFICATION, 'You\'re now logged in, please make sure you update your password from your <a href="/account/profile">profile</a>');
      res.redirect(303, _this.helpers.url());
    });
  },
  setUserSession: function (req, user) {
    var settings = user.settings || {};

    if (typeof settings === 'string') {
      try {
        settings = JSON.parse(settings);
      } catch (e) {
        settings = {};
      }
    }

    req.session.user = clone(user);
    req.session.user.settings = settings;
    req.session.user.lastLogin = user.last_login || new Date(); // jshint ignore:line
    req.session.user.avatar = req.app.locals.gravatar(user);

  },

  checkUserLoggedIn: function(req, res, next) {
    if (req.session.user) {
      return res.redirect('/');
    }
    next();
  },

  requiresLoggedIn: function (req, res, next) {
    if (!req.session.user) {
      req.flash(req.flash.REFERER, req.url);
      return res.redirect('/login');
    }

    next();
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
        // based on the 'name' key.
        _this.loadUser(req, res, function (err) {
          if (err) {
            return next(err);
          }

          if ('email' in params) {
            // There's an email so this is a registration.
            _this.createUser(req, res, next);
          } else {
            // No email, this is a login.
            _this.loginUser(req, res, function () {
              _this.redirectUserAfterLogin(req, res, next);
            });
          }
        });
      } else {
        return next(err);
      }
    });
  },
  respond: function (req, res, status, data) {
    if (res.ajax) {return res.json(status, data); }

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
   * DropBox Auth
   */

  dropboxAuth: [
    function (req, res, next) {
      req.session.referer = req.headers.referer;
      next();
    },
    passport.authenticate('dropbox-oauth2')
  ],

  dropboxPassportCallback: passport.authenticate('dropbox-oauth2', {
    failureRedirect: '/'
  }),

  dropboxCallback: function (req, res, next) {
    // This is because passport sticks the new deets on req.user;
    var dropboxUser = req.user;
    if (req.session.user) {
      req.session.user.dropbox_token = dropboxUser.accessToken; // jshint ignore: line
      req.session.user.dropbox_id = dropboxUser.id; // jshint ignore: line
      this.models.user.updateOwnershipData(req.session.user.name, {
        dropbox_token: dropboxUser.accessToken, // jshint ignore: line
        dropbox_id: dropboxUser.id // jshint ignore: line
      }, function (err) {
        if (err) {
          return next(err);
        }
        res.flash(req.flash.NOTIFICATION, 'Your dropbox account has been linked to JS Bin, all future bins will now be saved to dropbox');
        res.redirect(req.session.referer || '/');
      });
    } else {
      return res.send(400);
    }
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
      req.session.referer = req.session.referer || req.headers.referer;
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
              - 'Sorry, that GitHub account is linked to another JS Bin account.'
        - Not found?
          - Signed out
            - Find by github name
              - Found?
                - 'Please sign in to link accounts.'
              - Not found?
                - Create user
          - Signed in
            - Save GitHub data to user account & session
   */
  githubCallback: function(req, res) {
    var model = this.models.user;
    var githubUser = req.user,
        sessionUser = req.session.user;

    var redirect = req.session.referer || '/';
    delete req.session.referer;

    // Find user from GitHub id
    this.models.user.getOne('getUserByGithubId', [githubUser.profile.id], function (err, jsbinUser) {
      if (err) {
        return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, there was an error while accessing the database with your GitHub id (' + err + ')');
      }
      // Was a user found?
      if (jsbinUser) {
        // Is the user signed in?
        if (sessionUser) {
          // Do the JS Bin ids match? (weird edge case where somebody links twice)
          if (jsbinUser.name === sessionUser.name) {
            // Sign in and allow through
            this.setUserSession(req, jsbinUser);
            // Update the login timestamp
            model.touchLogin(jsbinUser.name, function () {});
            return res.redirect(redirect);
          }
          // IDs did not match.
          res.flash(res.flash.ERROR, 'Sorry, that GitHub account is linked to another JS Bin account.');
          return res.redirect(redirect);
        }

        // User is not signed in
        // Sign them back in as the jsbin user, updating their token
        jsbinUser.github_token = githubUser.access_token;  // jshint ignore:line
        return this.models.user.updateGithubData(jsbinUser.name, jsbinUser.github_id, jsbinUser.github_token, function (err) { // jshint ignore:line
          if (err) {
            return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, could not update your GitHub data & sign you in (' + err + ')');
          }
          // Add the user data to the session.
          this.setUserSession(req, jsbinUser);
          // Update the login timestamp
          model.touchLogin(jsbinUser.name, function () {});
          res.flash(res.flash.INFO, 'Welcome back.');
          return res.redirect(redirect);
        }.bind(this));
      }

      // Ok, no id matching JS Bin user was found.
      // Is the user signed in?
      if (sessionUser) {
        sessionUser.github_token = githubUser.access_token; // jshint ignore:line
        sessionUser.github_id = githubUser.profile.id; // jshint ignore:line
        // Hook the two users up
        return this.models.user.updateGithubData(sessionUser.name, sessionUser.github_id, sessionUser.github_token, function (err) { // jshint ignore:line
          if (err) {
            return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, could not connect your GitHub and JS Bin accounts (' + err + ')');
          }
          // Add the user data to the session.
          this.setUserSession(req, sessionUser);
          // Update the login timestamp
          model.touchLogin(sessionUser.name, function () {});
          res.flash(res.flash.NOTIFICATION, 'Your JS Bin account ('+sessionUser.name+') has been linked to your GitHub account ('+githubUser.profile.username+'). Nice.');
          return res.redirect(redirect);
        }.bind(this));
      }

      // No id matching user was found and the user is not signed in
      // Find by GitHub name
      this.models.user.load(githubUser.profile.username, function (err, jsbinUserFromGithubName) {
        if (err) {
          return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, there was an error while accessing the database with your GitHub username (' + err + ')');
        }
        // Was a name matching user found
        if (jsbinUserFromGithubName) {
          // Uh oh, that user exists already
          res.flash(res.flash.ERROR, 'Your GitHub username is taken on JS Bin. If this is you, please register with JS Bin and link your GitHub account. <a target="_blank" href="http://jsbin.com/help/github-username">Read this for more help</a>.');
          return res.redirect(redirect);
        }
        // No matching user was found, create an account!
        // Generate them a random password
        require('crypto').randomBytes(48, function(ex, buf) {
          var userData = {
            name: githubUser.profile.username,
            key: buf.toString('hex'),
            email: githubUser.profile.email || '',
            github_id: githubUser.profile.id, // jshint ignore:line
            github_token: githubUser.access_token, // jshint ignore:line
          };
          this.models.user.create(userData, function (err) {
            if (err) {
              return this.respondWithMessage(res, res.flash.ERROR, 'Sorry, there was an error while creating a new user (' + err + ')');
            }

            // Add the user data to the session.
            this.setUserSession(req, userData);
            // Update the login timestamp
            model.touchLogin(userData.name, function () {});
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
