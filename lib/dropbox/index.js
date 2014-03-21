'use strict';
var cp = require('child_process');
var child = cp.fork(__dirname + '/child.js');
var passport = require('passport');
var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;
var active = false;

module.exports = function (options) {
  return {
    initialize: function () {
      active = true;
      passport.use(new DropboxOAuth2Strategy({
        clientID: options.dropbox.id,
        clientSecret: options.dropbox.secret,
        callbackURL: 'http://jsbin.dev/auth/dropbox/callback'
      }, function (accessToken, refreshToken, profile, done) {
        done(null, profile);
      }
    ));
    }
  };
};

  saveBin: function(bin, user) {
    child.send({
      bin: bin,
      user: user
    });
  }

};
