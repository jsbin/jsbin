'use strict';

var fs = require('fs');

var info = [];

function load() {
  fs.readFile(__dirname + '/data/information.json', 'utf8', function (error, data) {
    if (error) {
      console.error('failed to load information.json');
      return;
    }
    
    try {
      info = JSON.parse(data);
    } catch (e) {
      console.error('failed to parse information.json');
    }
  });
}

load();

process.on('SIGHUP', load);

module.exports = {
  getData: function () {
    return info;
  }
};
