/*global module:false*/

// as in: grunt and grind
function grind(grunt) {

  // grunt.loadNpmTasks('grunt-closure-compiler');

  // Project configuration.
  var config = {
    pkg: '<json:../package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
      original: '/* View original: <%= pkg.name %>-<%= pkg.version %>.js */'
    },
    lint: {
      files: ['grunt.js', 'js/**/*.js']
    },
    concat: {
      dist: {
        // built dynamically
        // src: ['<banner:meta.banner>', 'public/js/intro.js', 'public/js/*.js', 'public/js/**/*.js', 'public/js/outro.js'],
        src: [],
        dest: 'js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.original>', '<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'js/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true,
        jsbin: true
      }
    }
    ,
    'closure-compiler': {
      frontend: {
        root: 'js/',
        js: '', // completed dynamically
        jsOutputFile: '<%= pkg.name %>-<%= pkg.version %>.min.js',
        sourcemap: '<%= pkg.name %>-<%= pkg.version %>.map',
        options: {
          create_source_map: '<%= pkg.name %>-<%= pkg.version %>.map',
          source_map_format: 'V3',
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT'
        }
      }
    }
  };

  var scripts = require('../scripts.json'),
      scriptsRelative = scripts.map(function (script) {
        return script.substring(1);
      });

  config.lint.files = scriptsRelative;
  config.concat.dist.src = scriptsRelative;
  config['closure-compiler'].frontend.js = scripts.map(function (script) {
    return script.substring(4);
  });
  config.concat.dist.src.unshift('js/intro.js');
  config.concat.dist.src.unshift('<banner:meta.banner>');
  config.concat.dist.src.push('js/outro.js');

  grunt.initConfig(config);
  // Default task.
  grunt.registerTask('default', 'concat min');
  grunt.registerTask('sourcemap', 'closure-compiler');
  // grunt.registerTask('lint', 'lint');

}


module.exports = grind;