'use strict';
var app = require('../app.js'),
    express = require('express'),
    SessionStore = require('memcached-express')(express),
    uid = require('uid');

var sessionStore = new SessionStore({
  hosts: ['localhost:11211']
});

var cookieSession = express.cookieSession({
  key: 'jsbin',
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000
    // domain: '.' + app.set('url host')
  }
});

var memorySession = express.session({
  key: 'jsbin',
  cookie: {
    maxAge: 365 * 24 * 60 * 60 * 1000
    // domain: '.' + app.set('url host')
  },
  store: sessionStore
});

function sessions (req, res, next){
  console.log('sessions');
  if (!req.signedCookies.jsbin || req.signedCookies.jsbin.constructor === String) { // new
    memorySession(req, res, next);
  } else {
    //old way
    console.log('cookies');
    cookieSession(req, res, function () {
      var SessionID = uid(24);
      console.log(req.session.cookie);
      req.session.cookie = {
        maxAge: 365 * 24 * 60 * 60 * 1000
      }
      sessionStore.set(SessionID, req.session);
      res.cookies('jsbin', SessionID);
      next();
    });
  }
}
app.use(sessions);
