/*global module:false*/
module.exports = function (grunt) {
  var fs = require('fs'),
      path = require('path'),
      exec = require('child_process').exec,
      lint = require('./jshint');

  // Runs JSBin with local config file.
  //
  // Config file defaults to config.node.json but can be provided as an
  // additional argument. Will also use nodemon if installed otherwise
  // falls back to using node.
  //
  // Example:
  //
  //   $ grunt run:config.local.json
  grunt.registerTask('run', 'Runs JSBin for local development', function (config) {
    var done = this.async(),
        filepath = path.join(__dirname, config || 'config.node.json'),
        cmd = '[ -e "`which nodemon`" ] && nodemon --debug . || node --debug .',
        child;

    // Set the config for the node app.
    try {
      if (fs.statSync(filepath).isFile() && !process.env.JSBIN_CONFIG) {
        process.env.JSBIN_CONFIG = filepath;
      }
    } catch (error) {
      // Ignore if file wasn't found.
      if (error.errno !== 34 /* ENOENT */) {
        throw error;
      }
    }

    child = exec(cmd, function (err, stdout, stderr) {
      if (err) {
        grunt.log.writeln(err.message);
        process.exit(err.code);
      }

      done();
    });

    child.stdout.on('data', process.stdout.write.bind(process.stdout));
    child.stderr.on('data', process.stderr.write.bind(process.stderr));
  });

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    test: {
      files: ['test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
    },
    run: {},
    jshint: {
      options: lint,
      globals: {}
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');

};
