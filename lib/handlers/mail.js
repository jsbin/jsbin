var Observable = require('../utils').Observable,
    errors = require('../errors');

module.exports = Observable.extend({
  constructor: function MailHandler(transport, render) {
    this.transport = transport;
    this.render = render;
  },
  forgotPassword: function (to, context, fn) {
    var transport = this.transport;
    if (!transport) {
      return fn(new errors.MailerError('Mail Transport is not configured'));
    }

    this.render('reset_email.txt', context, function (err, body) {
      if (err) {
        return fn(err);
      }

      transport.sendMail({
        from: "JSBin <dave-the-robot@jsbin.com>",
        to: to,
        subject: 'JSBin Password Reset',
        text: body
      }, fn);
    });
  },
  errorReport: function (to, context, fn) {
    var transport = this.transport;
    if (!transport) {
      return fn(new errors.MailerError('Mail Transport is not configured'));
    }

    this.render('error_email.txt', context, function (err, body) {
      if (err) {
        return fn(err);
      }

      transport.sendMail({
        from: "JSBin <dave-the-robot@jsbin.com>",
        to: to,
        subject: 'JSBin Internal Server Error',
        text: body
      }, fn);
    });
  }
});
