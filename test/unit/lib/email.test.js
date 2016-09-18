var test = require('tap-only');
global.Promise = require('promise'); // expose
var root = __dirname + '/../../..';
var emailSender = require(root + '/lib/email');

test('welcome email', function (t) {
  var data = {
    name: 'remy',
    email: 'remy@jsbin.com'
  };
  return emailSender.send({
    filename: 'welcome',
    data: { user: {
      name: data.name,
      email: data.email,
    }, },
    to: data.email,
    subject: 'Welcome!',
  }).then(function () {
    t.ok('email sent');
  });
});
