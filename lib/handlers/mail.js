var Observable = require('../utils').Observable,
    errors = require('../errors');

module.exports = Observable.extend({
  constructor: function MailHandler(transport, render) {
    this.transport = transport;
    this.render = render;
  },
  isEnabled: function () {
    return !!this.transport;
  },
  forgotPassword: function (to, context, fn) {
    var _this = this;

    this.render('reset_email.txt', context, function (err, body) {
      if (err) {
        return fn(err);
      }

      _this.sendMail({
        from: "Dave <dave-the-robot@jsbin.com>",
        to: to,
        subject: 'JS Bin Password Reset',
        text: body
      }, fn);
    });
  },
  errorReport: function (to, context, fn) {
    var _this = this;

    this.render('error_email.txt', context, function (err, body) {
      if (err) {
        return fn(err);
      }

      _this.sendMail({
        from: "Dave <dave-the-robot@jsbin.com>",
        to: to,
        subject: 'JS Bin Crash Report: ' + context.message + ' #' + context.hash,
        text: body
      }, fn);
    });
  },
  sendMail: function (options, fn) {
    var error = new errors.MailerError('Mail Transport is not configured');

    if (!this.transport) {
      return fn(error);
    }

    this.transport.sendMail(options, function (err) {
      if (typeof fn === 'function') {
        fn(err ? error : null);
      }
    });
  }
});
