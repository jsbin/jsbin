'use strict';

var RSVP = require('rsvp');
var fork = require('child_process').fork;

module.exports = function (language, source) {
  return new RSVP.Promise(function (resolve, reject) {
    var child = fork(__dirname);
    var output = '';

    var timeout = setTimeout(function () {
      console.error(language + ' processor timeout');
      child.kill();
    }, 1000);

    child.on('stderr', function (data) {
      console.error(language + ' processor errors');
      console.error(data);
    });

    child.on('message', function (message) {
      output += message;
    });

    child.on('exit', function () {
      clearTimeout(timeout);
      try {
        resolve(JSON.parse(output));
      } catch (e) {
        reject({
          ouput: {
            result: '',
            errors: null
          },
          error: new Error('Could not parse response from', language)
        });
      }
    });

    child.send({ language: language, data: source});
  });
};
