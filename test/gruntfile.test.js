'use strict';
/*global describe:true, it: true */
var assert = require('assert'),
    grunt = require('grunt'),
    pwd = process.cwd(),
    path = require('path');


describe('Gruntfile', function () {
  it('should exit cleanly', function (done) {
    var gruntPath = path.resolve(pwd, 'node_modules/grunt-cli/bin/grunt');

    console.log(path.resolve(pwd, 'Gruntfile.js'));

    grunt.util.spawn({
      cmd: 'node',
      // grunt: true, // not running grunt in the first place
      args: [gruntPath, '--gruntfile', path.resolve(pwd, 'Gruntfile.js'), 'build'],
    }, function (error, result) {
      console.log(result);
      assert(result.code === 0, 'exit code: ' + result.code);
      assert(result.stdout, 'there was some output');

      done();
    });
  });
});