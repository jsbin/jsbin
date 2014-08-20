'use strict';
var Sendy = require('sendy-api');

var config = require('../../config');
var features = require('../../features');

var sendy;

if (features('sendy')) {
  sendy = new Sendy(config.mail.sendy.url, config.mail.sendy.key);
}

var noop = function () {
  // console.log.apply(console, [].slice.apply(arguments));
};

var wrapSendy = function (method) {
  return function () {
    var fn = arguments[method.length];
    if (typeof fn !== 'function') {
      fn = noop;
    }
    if (!features('sendy')) {
      return fn(null, null);
    }
    return method.apply(null, arguments);
  };
};

function setSubscribed(user, subscribed, fn) {
  var method = (subscribed ? '' : 'un') + 'subscribe';
  sendy[method]({
    email: user.email,
    name: user.name,
    Id: user.id,
    list_id: config.mail.sendy.announcement_list // jshint ignore: line
  }, fn || noop);
}

function getSubscribed(email, fn) {
  sendy.status({
    email: email,
    list_id: config.mail.sendy.announcement_list // jshint ignore: line
  }, fn || noop);
}

function setSubscribedOnUser(req, res, next) {
  if (!req.session.user) {
    return next();
  }
  var email = req.session.user.email;
  if (!email) {
    req.session.user.subscribed = false;
    return next();
  }
  getSubscribed(email, function (err, res) {
    if (err) {
      if (err.message === 'Email does not exist in list') {
        req.session.user.subscribed = false;
        return next();
      }
      console.error('sendy error', err);
      req.mailError = err;
      return next();
    }
    var subscribed = res === 'Subscribed';
    req.session.user.subscribed = subscribed;
    next();
  });
}

exports.setSubscribed = wrapSendy(setSubscribed);
exports.getSubscribed = wrapSendy(getSubscribed);
exports.middleware = {};
exports.middleware.setSubscribedOnUser = setSubscribedOnUser;
