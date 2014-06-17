'use strict';

var fs = require('fs');

var info = [];
var reg = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i;
var root = require('./config').url.host || '';
var m;
var extUrls = function(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key == 'link') {
        m = obj[key].match(reg);
        if (m && m[1] !== root) {
          obj.ext = true;
        }
      } else if (typeof obj[key] === 'object') {
        extUrls(obj[key]);
      }
    }
  }
};

function load() {
  fs.readFile(__dirname + '/data/welcome-panel.json', 'utf8', function (error, data) {
    if (error) {
      console.error('failed to load welcome-panel.json');
      return;
    }
    
    try {
      info = JSON.parse(data);
      extUrls(info);
    } catch (e) {
      console.error('failed to parse welcome-panel.json');
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
