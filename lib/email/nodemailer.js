var nodemailer = require('nodemailer');

function createTransport(authObj) {
  var transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: authObj,
  });

  return transporter;
}

module.exports = createTransport;
