module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    coverage: {
      default: {
        options: {
          thresholds: {
            'statements': 90,
            'branches': 90,
            'lines': 90,
            'functions': 90
          },
          dir: 'coverage',
          root: 'test'
        }
      }
    },
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: ']/main.js'
        }
      },
      prod: {
        options: {
          script: 'www/server/main.js',
          node_env: 'production'
        }
      },
      test: {
        options: {
          script: 'server/main.js'
        }
      }
    },
    mochaTest: {
      server: {
        src: ['server/test/**/*.js'],
        options: {
          reporter: 'nyan'
        }
      },
      all: {
        src: ['test/api/**/*.js'],
        options: {
          reporter: 'nyan',
          timeout: 25000
        }
      },
      coverage: {
        src: ['test/coverage/instrument/**/*.js'],
        options: {
          reporter: 'spec',
          timeout: 25000
        }
      }
    },
    // This will build a zip file that can be copied to S3 and then deployed using CloudFormation
    compress: {
      main: {
        options: {
          archive: '../dist/server/openfdaviz-server.zip'
        },
        files: [
          {src: ['**', '!node_modules/**'], dest: '/', filter: 'isFile'}
        ]
      }
    },
    aws: grunt.file.readJSON('../aws.json'),
    aws_s3: {
      options: {
        // the aws. variables come from the aws.json file loaded above
        accessKeyId: '<%= aws.AWSAccessKeyId %>',
        secretAccessKey: '<%= aws.AWSSecretKey %>',
        region: 'us-east-1',
        uploadConcurrency: 5, // 5 simultaneous uploads
        downloadConcurrency: 5 // 5 simultaneous downloads
      },
      production: {
        options: {
          bucket: 'openfdaviz'
        },
        files: [
          {expand: true, cwd: '../dist/server/', src: ['**'], dest: '/'}
        ]
      }
    },
    shell: {
      start: {
        command: 'PORT=3002 node_modules/forever/bin/forever start app.js'
      }
    },
    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: 'test/coverage/instrument/app/'
      }
    },
    instrument: {
      files: 'api/**/*.js',
      options: {
        lazy: true,
        basePath: 'test/coverage/instrument/'
      }
    },
    storeCoverage: {
      options: {
        dir: 'test/coverage/reports'
      }
    },
    makeReport: {
      src: 'test/coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'test/coverage/reports',
        print: 'detail'
      }
    }
  });

  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks('grunt-istanbul-coverage');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');

  // Register other tasks
  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['mochaTest:all','env:coverage', 'instrument', 'mochaTest:coverage', 'storeCoverage', 'makeReport']);
  grunt.registerTask('build', ['test', 'compress']);
  grunt.registerTask('deploy', ['build', 'aws_s3']);
  grunt.registerTask('start', ['build', 'shell:start']);
};
