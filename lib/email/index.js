var createTransport = require('./nodemailer');
var config = require('../config');
var undefsafe = require('undefsafe');
var EmailService = require('./EmailService');
var dummy = require('./Dummy');
var settings = undefsafe(config, 'email.settings');

if (undefsafe(config, 'email.auth')) {
  module.exports = new EmailService(createTransport(config.email.auth), settings);
} else {
  module.exports = new EmailService(dummy, settings); // suck
}

module.exports.send = require('./quick-send');
