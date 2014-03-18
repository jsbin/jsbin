'use strict';
var child_process = require('child_process');
var child = child_process.fork(__dirname + '/index.js');

var binToSave = {
  url: 'basecannon2',
  html: '<p> Let the basecannon2 kick it </p>'
};

var user = {
  dropbox_token: 'ti7z0APpzVYAAAAAAAAAAdKu6CAnmH9Tsq-aPsqAAr5nmx7TFeuQRq1_URZuh5RJ'
};

child.on('message', function(message) {
  message.log && console.log(message.log); // jshint ignore:line
});

function sendTheBin () {
  child.send({
    user: user,
    bin: binToSave
  });
}

sendTheBin();

setTimeout(sendTheBin, 4000);
