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

  var pkg = grunt.file.readJSON('package.json');

  var distpaths = {
    script: 'public/js/prod/<%= pkg.name %>-<%= pkg.version %>.js',
    map:    'public/js/prod/<%= pkg.name %>.map.json', // don't version this so we overwrite
    min:    'public/js/prod/<%= pkg.name %>-<%= pkg.version %>.min.js'
  };

  var config = {
    pkg: pkg,
    scriptsRelative: require('./scripts.json').map(function (script) {
      return 'public' + script;
    }),
    jshint: {
      dist: {
        files: {
          src: ['grunt.js', 'lib/**/*.js']
        }
      },
      build: {
        files: {
          src: '<%= scriptsRelative %>'
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'public/js/intro.js',
          '<%= scriptsRelative %>',
          'public/js/outro.js'
        ],
        dest: distpaths.script
      }
    },
    uglify: {
      options: {
        compress: { unsafe: false },
      },
      dist: {
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                  '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
          sourceMap: distpaths.map,
          sourceMappingURL: '/js/prod/jsbin.map.json',
          sourceMapPrefix: 2,
          sourceMapRoot: '/js',
        },
        src: '<%= scriptsRelative %>',
        dest: distpaths.min
      }
    },
    watch: {
      files: '<%= lint.files %>',
      tasks: 'lint'
    },
    run: {}
  };

  // Project configuration.
  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task.
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('default', ['jshint']);

};
