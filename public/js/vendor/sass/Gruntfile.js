module.exports = function(grunt) {
  'use strict';

  var jshintOptions = grunt.file.readJSON('.jshintrc');
  jshintOptions.reporter = require('jshint-stylish');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['dist'],
      build: ['dist/*.txt']
    },

    concat: {
      sass: {
        src: ['src/libsass.js', 'src/sass.js'],
        dest: 'dist/sass.js',
        options: {
          banner: ['/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
            '(function (root, factory) {',
            '  \'use strict\';',
            '  if (typeof define === \'function\' && define.amd) {',
            '    define([], factory);',
            '  } else if (typeof exports === \'object\') {',
            '    module.exports = factory();',
            '  } else {',
            '    root.Sass = factory();',
            '  }',
            '}(this, function () {'].join('\n'),
          footer: 'return Sass;\n}));',
          process: function (content) {
            // prevent emscripted libsass from exporting itself
            return content.replace(/module\['exports'\] = Module;/, '');
          }
        }
      },
      'sass-worker': {
        src: ['src/sass.worker.js'],
        dest: 'dist/sass.worker.js',
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - web worker - <%= grunt.template.today("yyyy-mm-dd") %> */'
        }
      },
      worker: {
        src: ['src/libsass.worker.js'],
        dest: 'dist/worker.js',
        options: {
          banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - web worker - <%= grunt.template.today("yyyy-mm-dd") %> */',
          process: function (content) {
            // make the worker load the combined minified file
            return content.replace(/importScripts\('libsass\.js', 'sass\.js'\);/, 'importScripts(\'sass.min.js\');');
          }
        }
      },
      'worker-inline': {
        src: ['dist/sass.min.js', 'dist/worker.js'],
        dest: 'dist/worker.min.js',
        options: {
          process: function (content) {
            // libsass and sass API are inlined, so no need to load them
            return content.replace(/importScripts\('sass\.min\.js'\);/, '');
          }
        }
      }
    },

    'closure-compiler': {
      sass: {
        closurePath: './bin/closure-compiler',
        js: 'dist/sass.js',
        jsOutputFile: 'dist/sass.min.js',
        options: {
          /*jshint camelcase:false*/
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5'
          /*jshint camelcase:true*/
        }
      }
    },

    mochaTest: {
      src: ['test/**/test.*.js']
    },

    jshint: {
      options: jshintOptions,
      target: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js',
        '!src/libsass.js'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('build:sass', ['concat:sass', 'closure-compiler:sass', 'clean:build']);
  grunt.registerTask('build:worker', ['concat:worker', 'concat:worker-inline', 'concat:sass-worker']);
  grunt.registerTask('build', ['clean:dist', 'build:sass', 'build:worker']);
  grunt.registerTask('lint', 'jshint');
  grunt.registerTask('test', 'mochaTest');
};
