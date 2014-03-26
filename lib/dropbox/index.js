'use strict';
var cp = require('child_process');
var child = cp.fork(__dirname + '/child.js');
var passport = require('passport');
var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;
var active = false;

module.exports = function (options) {
  child.send({
    options: options.dropbox
  });
  return {
    initialize: function () {
      active = true;
      passport.use(new DropboxOAuth2Strategy({
        clientID: options.dropbox.id,
        clientSecret: options.dropbox.secret,
        callbackURL: options.dropbox.callback
      }, function (accessToken, refreshToken, profile, done) {
        profile.accessToken = accessToken;
        done(null, profile);
      }
    ));
    }
  };
};

module.exports.saveBin = function (file, fileName, user) {
  if (!active) {
    return;
  }
  child.send({
    file: file,
    fileName: fileName,
    user: user
  });
};

// child.on('message', function(msg){
//   if (msg.log) {
//     console.log(msg.log);
//   }
// });
