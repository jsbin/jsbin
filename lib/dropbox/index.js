'use strict';
var cp = require('child_process');
var child = cp.fork(__dirname + '/child.js');

module.exports = {

  saveBin: function(bin, user) {
    child.send({
      bin: bin,
      user: user
    });
  }

};
