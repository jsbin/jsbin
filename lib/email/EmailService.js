var EmailService = function EmailService(transporter, settings) {
  this.transporter = transporter;
  this.settings = settings;
};

EmailService.prototype.createEmail = function (to, opts) {
  var text, subject;
  if (opts) {
    if (typeof opts === 'string') {
      text = opts;
      subject = this.settings.subject;
    } else {
      text = opts.body || opts.text || '';
      subject = opts.subject || this.settings.subject;
    }
  } else {
    opts = to;
    to = opts.to;
    subject = opts.subject || this.settings.subject;
    text = opts.body || opts.text || '';
  }
  var emailData = {
    from: opts.from || this.settings.from,
    to: to,
    subject: subject,
    text: text
  };
  var email = new Email(this, emailData);
  return email;
};

EmailService.prototype.sendEmail = function (email) {
  var self = this;
  if (email instanceof Email) {
    email = email.data;
  }
  var promise = new Promise(function (resolve, reject) {
    self.transporter.sendMail(email, function (err, info) {
      if (err) {
        return reject(err);
      }
      resolve(info);
    });
  });
  return promise;
};

var Email = function Email(Service, data) {
  this.Service = Service;
  this.data = data;
  Object.defineProperty(this, 'body', {
    set: function (newValue) {
      this.data.text = newValue;
    }
  });
};

Email.prototype.send = function (to) {
  if (typeof to === 'string') {
    this.data.to = to;
  }
  return this.Service.sendEmail(this.data);
};

module.exports = EmailService;
