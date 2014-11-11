var test = require('tape');

var request = require('request');

test('jsbin', function (jsbin) {

  jsbin.test('can connect', function (t) {
    t.plan(1);
    request.get('http://localhost:3000', function (err, res, body) {
      if (err) {
        return t.fail(err); 
      }
      t.pass('No error from jsbin homepage');
    });
  });

  jsbin.test('can load full output', function (t) {
    t.plan(1); 
    request.get('http://localhost:3000/cuqequdenu', function (err, res, body) {
      if (err || body.indexOf('THIS IS A TEST') === -1) {
        return t.fail(err || 'Did not contain expected output'); 
      }
      t.pass('Full output contained the string "THIS IS A TEST"');
    });
  });

  jsbin.end();

});
