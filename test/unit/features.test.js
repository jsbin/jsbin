var proxyquire = require('proxyquire');
var test = require('tap').test;
var features = proxyquire('../../lib/features', {
  './config': {
    security: {
      embedWhiteList: ['https://foo.com']
    }
  }
});

test('whitelist works', function (t) {
  var req = {
    headers: {
      referrer: 'https://foo.com'
    },
    get: function (key) {
      return req.headers[key.toLowerCase()];
    }
  };

  var res = features('sslForEmbeds', req);
  t.equal(res, true, 'foo.com allowed');

  req.headers.referrer = 'http://bar.com';
  res = features('sslForEmbeds', req);
  t.equal(res, false, 'bar.com disallowed');

  req.headers.referrer = '';
  res = features('sslForEmbeds', req);
  t.equal(res, false, 'no referrer disallowed');

  req.headers.referrer = 'http://fooy.com';
  res = features('sslForEmbeds', req);
  t.equal(res, false, 'close referrer disallowed');

  t.end();
});
