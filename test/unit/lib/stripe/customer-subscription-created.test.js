var test = require('tap-only');
global.Promise = require('promise'); // expose
var root = __dirname + '/../../../..';
var event = require(root + '/test/fixtures/customer.subscription.created.json').data.object;
var user = require(root + '/test/fixtures/customer.json');

test('customer.subscription.created', function (t) {
  var handler = require(root + '/lib/stripe/handlers/customer.subscription.created.js');
  var stripe = {
    customers: {
      retrieve: function (id) {
        return Promise.resolve(user);
      }
    }
  };

  handler(stripe)({}, event, function (error, res) {
    setTimeout(function () {
      t.ok(res, 'got response');
      t.equal(error, null, 'no error');
      t.end();
    }, 200);
  });
});
