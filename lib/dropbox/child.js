'use strict';
process.on('message', addToDropboxQueue);

var Dropbox = require('dropbox');

// delayTime in seconds;
var delayTime = 10;
delayTime *= 1000;
var queue = {};

function addToDropboxQueue (message) {
  var bin = message.bin;
  var user = message.user;
  var fileContent = fileFromBin(bin);
  var id = bin.url;
  var saveObject = {
    file: fileContent,
    token: user.dropbox_token, // jshint ignore:line
    timeout: setTimeout(function(){
      saveToDropBox(fileContent, fileNameFromBin(bin), user);
    }, delayTime)
  };
  if (queue[id]) {
    clearTimeout(queue[id].timeout);
  }
  log('adding to queue');
  queue[id] = saveObject;
}

function saveToDropBox (file, name, user) {
  log('actually saving it now');
  var client = new Dropbox.Client({
    key: '89twf77glqma71r',
    secret: '0ncbr1qrcv9ek38',
    token: user.dropbox_token // jshint ignore:line
  });

  client.writeFile(name, file, function (err) {
    if (err) {
      process.send({
        error: err,
        user: user
      });
    }
    log('saved!');
  });

}

function fileNameFromBin (bin) {
  return bin.url + '.html';
}

function fileFromBin (bin) {
  return bin.html;
}

function log (msg) {
  process.send({log: msg});
}
