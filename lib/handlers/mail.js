var Observable = require('../utils').Observable;

module.exports = Observable.extend({
  constructor: function MailHandler(transport, render) {
    this.transport = transport;
    this.render = render;
  },
  forgotPassword: function (to, context, fn) {
    var transport = this.transport;
    this.render('reset_email.txt', context, function (err, body) {
      if (err) {
        return fn(err);
      }

      transport.sendMail({
        from: "JSBin <help@jsbin.com>",
        to: to,
        subject: 'JSBin Password Reset',
        text: body
      }, fn);
    });
  }
});
