'use strict';

var fs = require('fs');

var data = [];

function load() {
  fs.readFile('./data/information.json', 'utf8', function (error, data) {
    if (error) {
      console.error('failed to load information.json');
      return;
    }
    
    try {
      data = JSON.parse(data);  
    } catch (e) {
      console.error('failed to parse information.json');
    }
  });
}

load();

process.on('SIGHUP', load);

module.exports = {
  getData: function () {
    return data;
  }
};
