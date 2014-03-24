'use strict';
process.on('message', handleMessages);

var Dropbox = require('dropbox');
var options;

// delayTime in seconds;
var delayTime = 10;
delayTime *= 1000;
var queue = {};

function addToDropboxQueue (message) {
  var user = message.user;
  var fileContent = message.file;
  var fileName = message.fileName;
  var saveObject = {
    file: fileContent,
    token: user.dropbox_token, // jshint ignore:line
    timeout: setTimeout(function(){
      saveToDropBox(fileContent, fileName, user);
    }, delayTime)
  };
  if (queue[fileName]) {
    clearTimeout(queue[fileName].timeout);
  }
  log('adding to queue');
  queue[fileName] = saveObject;
}

function saveToDropBox (file, name, user) {
  log('actually saving it now');
  var client = new Dropbox.Client({
    key: options.id,
    secret: options.secret,
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

function log (msg) {
  process.send({log: msg});
}

function handleMessages(message) {
  if (message.file) {
    log('recieved bin');
    addToDropboxQueue(message);
  } else
  if (message.options) {
    options = message.options;
  }
}
