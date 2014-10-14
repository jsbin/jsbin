'use strict';
var passport = require('passport');
var DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy;
var active = false;
var noop = function () {};
try {
  var zmq = require('zmq');
  var socket = zmq.socket('push');
} catch (err){
  console.log('Failed to connect to dropbox');
  zmq = null
  socket = {
    send: noop
  }
};

module.exports = function (options) {
  return !!zmq ? {
    initialize: function () {
      socket.bind(options.dropbox.port, function(err) {
        if (err) {
          console.error(err);
        }
      });
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
  } : { initialize: noop }
};

module.exports.saveBin = function (file, fileName, token) {
  socket.send(JSON.stringify({
    type:'dropbox',
    file: file,
    fileName: fileName,
    token: token
  }));
};
