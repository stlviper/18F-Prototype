module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        debug: true
      },
      pkg: grunt.file.readJSON('package.json'),
      npm: {
        src: 'assets/lib/npm-lib.js',
        dest: 'build/js/npm-lib.js'
      }
    },
    clean: {
      dev: [ 'build', 'index.html' ],
      prod: [ 'build' ]
    },
    concat: {
      cssNpmLib:{
        src: [
          'node_modules/bootstrap/dist/css/bootstrap.min.css',
          'node_modules/leaflet/dist/leaflet.css',
          'assets/css/d3/c3.min.css'
        ],
        dest: 'build/css/npm-lib.css'
      },
      cssVendor:{
        src: [
          'assets/css/d3/d3.slider.css'
        ],
        dest: 'build/css/vendor-lib.css'
      },
      js: {
        src: 'app/**/*.js',
        dest: 'build/js/src.js'
      },
      vendor: {
        src: 'assets/js/**/*.js',
        dest: 'build/js/vendor.js'
      }
    },
    copy: {
      prodIndex: {
        files: [{
          src: ['assets/html/index_prod.html'],
          dest: '../dist/client/index.html'
        }]
      },
      devIndex: {
        files: [{
          src: ['assets/html/index_dev.html'],
          dest: 'index.html'
        }]
      },
      npmLib: {
        files: [{
          src: ['build/js/npm-lib.js'],
          dest: '../dist/client/js/npm-lib.js'
        }]
      },
      vendorCss: {
        files: [{
          src: ['build/css/npm-lib.css'],
          dest: '../dist/client/css/npm-lib.css'
        },
        {
          src: ['build/css/vendor-lib.css'],
          dest: '../dist/client/css/vendor-lib.css'
        },
        {
          src: ['build/css/openfdaviz.css'],
          dest: '../dist/client/css/openfdaviz.css'
        }]
      }
    },
    jshint: {
      files: ['app/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    mochaTest: {
      client: {
        src: ['test/mocha/**/*.js'],
        options: {
          reporter: 'nyan'
        }
      }
    },
    ngtemplates: {
      openfdaviz: {
        src: 'app/**/*.html',
        dest: 'build/js/templates.js',
        options: {
          prefix: '/'
        }
      }
    },
    protractor: {
      options: {
        configFile: "node_modules/protractor/example/conf.js", // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      run: {   // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
        options: {
          configFile: "test/selenium/e2e.conf.js", // Target-specific config file
          args: {} // Target-specific arguments
        }
      }
    },
    sass: {
      dev: {
        files: [{
          'build/css/openfdaviz.css': 'assets/sass/**/*.scss'
        }]
      },
      dist: {
        files: [{
          '../dist/client/css/openfdaviz.css': 'sass/*.scss'
        }]
      }
    },
    shell: {
      startDev: {
        command: 'node_modules/forever/bin/forever start test/mockserver/mockserver_dev.js'
      },
      startProd: {
        command: 'node_modules/forever/bin/forever start test/mockserver/mockserver_prod.js'
      }
    },
    uglify: {
      all: {
        files: [
          {
            expand: true,
            cwd: './build/js/',
            src: ['*.js', '!npm-lib.js'],
            dest: '../dist/client/js/',
            ext: '.min.js'
          }
        ]
      }
    },
    protractor_webdriver: {
      options: {},
      all: {}
    }
  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');

  //to install, run npm install -g protractor, to start protractor independently, first run webdriver-manager start --standalone
  grunt.loadNpmTasks('grunt-protractor-runner');
  //to install, run node_modules/protractor/bin/webdriver-manager update --standalone --chrome
  grunt.loadNpmTasks('grunt-protractor-webdriver');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-shell');

  // Register other tasks
  grunt.registerTask('start:dev', ['build', 'shell:startDev']);
  grunt.registerTask('start:prod', ['build:prod', 'shell:startProd']);
  grunt.registerTask('test', ['mochaTest:client']);
  grunt.registerTask('selenium', ['protractor_webdriver', 'protractor:run']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['sass:dev', 'concat', 'browserify', 'copy:devIndex', 'copy:vendorCss', 'ngtemplates', 'test']);
  grunt.registerTask('build:prod', ['build', 'sass:dist', 'uglify', 'copy:npmLib', 'copy:prodIndex']);
  grunt.registerTask('deploy', ['clean', 'build:prod']);

};
