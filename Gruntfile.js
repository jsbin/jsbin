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

  var scriptsRelative = require('./scripts.json').map(function (script) {
    return 'public' + script;
  });

  var pkg = grunt.file.readJSON('package.json');

  var distpaths = {
    script: 'public/js/prod/<%= pkg.name %>-<%= pkg.version %>.js',
    map:    'public/js/prod/<%= pkg.name %>.map.json', // don't version this so we overwrite
    min:    'public/js/prod/<%= pkg.name %>-<%= pkg.version %>.min.js'
  };

  var config = {
    pkg: pkg,
    jshint: {
      dist: {
        files: {
          src: ['grunt.js', 'lib/**/*.js']
        }
      },
      build: {
        files: {
          src: [].slice.apply(scriptsRelative)
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [].slice.apply(scriptsRelative),
        dest: distpaths.script
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: distpaths.map,
        sourceMapPrefix: 2,
        sourceMapRoot: '/js'
      },
      dist: {
        src: scriptsRelative,
        dest: distpaths.min
          // 'public/js/<%= pkg.name %>-<%= pkg.version %>.min.js' : scriptsRelative
      }
    },
    watch: {
      files: '<%= lint.files %>',
      tasks: 'lint'
    },
    run: {}
  };

  grunt.registerTask("postbuild", function() {
    var filename = grunt.template.process(distpaths.min, pkg),
        text = fs.readFileSync( filename, "utf8" );

    grunt.log.writeln('checking ' + filename + ' (' + text.length + ')');

    // Modify map/min so that it points to files in the same folder;
    // see https://github.com/mishoo/UglifyJS2/issues/47
    // if (/\.map.json$/.test(filename)) {
    //   text = text.replace( /"public\//g, "\"/" );
    //   fs.writeFileSync( filename, text, "utf-8" );
    // } else 

    if (/\.min\.js$/.test(filename)) {
      // Wrap sourceMap directive in multiline comments (#13274)
      text = text.replace(/\n?(\/\/@\s*sourceMappingURL=)(.*)/,
        function( _, directive, path ) {
          map = "\n" + directive + path.replace( /^public\/js/, "/js" );
          return "";
        });
      if (map) {
        text = text.replace( /(^\/\*[\w\W]*?)\s*\*\/|$/,
          function( _, comment ) {
            return ( comment || "\n/*" ) + map + "\n*/";
          });
      }
      fs.writeFileSync( filename, text, "utf-8" );
    }
});


  config.concat.dist.src.unshift('public/js/intro.js');
  config.concat.dist.src.push('public/js/outro.js');


  // Project configuration.
  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jsmin-sourcemap');

  // Default task.
  grunt.registerTask('build', ['concat', 'uglify', 'postbuild']);
  grunt.registerTask('default', ['jshint']);

};
