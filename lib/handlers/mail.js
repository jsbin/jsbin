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
        return fn ? fn(err) : null;
      }

      _this.sendMail({
        from: 'Dave <dave-the-robot@jsbin.com>',
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
        return fn ? fn(err) : null;
      }

      _this.sendMail({
        from: 'Dave <dave-the-robot@jsbin.com>',
        to: to,
        subject: 'JS Bin Crash Report: ' + context.message + ' #' + context.hash,
        text: body
      }, fn);
    });
  },
  reportBin: function (to, context, fn) {
    var _this = this;

    this.render('report_email.txt', context, function (err, body) {
      if (err && fn) {
        return fn ? fn(err) : null;
      }

      _this.sendMail({
        from: context.from || 'Dave <dave-the-robot@jsbin.com>',
        to: to,
        subject: 'JS Bin Abuse Report',
        text: body
      }, fn);
    });
  },
  sendMail: function (options, fn) {
    var error = new errors.MailerError('Mail Transport is not configured');

    if (!this.transport) {
      return fn ? fn(error) : null;
    }

    this.transport.sendMail(options, function (err) {
      if (fn) {
        fn(err ? error : null);
      }
    });
  }
});
