module.exports = send;
/* globals Promise */
var email = require('./index');
var fs = require('then-fs');
var path = require('path');
var hbs = require('express-hbs');
var undefsafe = require('undefsafe');
var emailRoot = path.resolve(__dirname, '..', '..', 'emails');
var config = require('../config');
require('../hbs'); // load helpers if they're not there yet

// register the header + footer partial
['email-header', 'email-footer'].forEach(function (name) {
  var template = fs.readFileSync(emailRoot + '/' + name + '.html', 'utf8');
  hbs.registerPartial(name, template);
});

function send(emailData) {
  if (!emailData.from) {
    emailData.from = 'support@jsbin.com';
  }

  var promises = [];

  if (emailData.body) {
    promises.push(Promise.resolve(emailData.body));
  } else if (emailData.filename) {
    promises = ['txt', 'html'].map(function (type) {
      var filename = path.resolve(emailRoot, emailData.filename + '.' + type);
      return fs.readFile(filename, 'utf8').catch(function (error) {
        if (type === 'html') { // swallow missing HTML files
          return null;
        }
        throw error;
      });
    });
  }

  return Promise.all(promises).then(function (res) {
    var body = res[0];
    var html = res[1];

    var bodyString = hbs.handlebars.compile(body)(emailData.data);
    var htmlString = null;
    if (html) {
      htmlString = hbs.handlebars.compile(html)(emailData.data);
    }

    var subject = hbs.handlebars.compile(emailData.subject)(emailData.data);

    return new Promise(function (resolve) {
      resolve(email.sendEmail({
        to: emailData.to,
        from: emailData.from,
        bcc: emailData.bcc || undefsafe(config, 'email.settings.bcc'),
        subject: '[JS Bin] ' + subject,
        text: bodyString,
        html: htmlString,
        quiet: emailData.quiet,
      }));
    });
  });
}
