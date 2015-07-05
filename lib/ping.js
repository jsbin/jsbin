// var dirsum = require('dirsum');
var path = require('path');
var os = require('os');
var https = require('https');
var shasum = require('crypto').createHash('sha1');
var version = require(path.resolve(__dirname, '..', 'package.json')).version;
var interfaces = os.networkInterfaces();
var name = '';

function ping(data) {
  var payload = JSON.stringify(data);

  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': payload.length,
    'Authorization': 'b6c17858daaf66397c5902ff97f44438e299379066377ccd78df3b254e47dbd4d74e2da197359868d1901bc6b7cf105a57d98c8d64bf17b51113feabadaa9618ddbad5755a63ea8b3cb24091af12621884833c149e573b70e816522a1cb9804b47ef96803503c25b6245a6aeda1ca2cc',
  };

  var options = {
    hostname: 'api.keen.io',
    port: 443,
    path: '/3.0/projects/5594138d672e6c4d2836c1c3/events/installs',
    method: 'POST',
    headers: headers,
  };

  // Setup the request.  The options parameter is
  // the object we defined above.
  var req = https.request(options, function(res) {});
  req.on('error', function(){}); // swallow
  req.write(payload);
  req.end();
}

function getMAC() {
  return Object.keys(interfaces).sort().reduce(function (acc, curr) {
    if (curr.indexOf('en') === 0  && name.indexOf('en') === -1) {
      name = curr;
      return interfaces[curr][0].address;
    }

    if (acc) {
      return acc;
    }

    if (curr.indexOf('lo') === -1 && interfaces[curr].length) {
      name = curr;
      return interfaces[curr][0].address;
    }
  }, '');
}

// fingerprint is just a unique way of indentifying individual installs
// so I have some numbers on it, nothing more than that.
var mac = getMAC();
if (mac) {
  ping({
    fingerprint: shasum.update(mac).digest('hex'),
    version: version
  });
}



// find . -type f -print0 | sort -z | xargs -0 shasum | shasum
// dirsum.digest(path.resolve(__dirname, '..'), 'sha1', function(err, hashes) {
//   if (err) throw err;
//   console.log(hashes.hash);
// });