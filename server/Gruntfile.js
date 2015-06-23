module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		express: {
			options: {
				// Override defaults here
			},
			dev: {
				options: {
					script: ']/main.js'
				}
			},
			prod: { // TODO: decide where prod is
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
				src: ['test/api/**/*.js' ],
				options: {
					reporter: 'nyan',
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
                accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
                secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
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
    }
  });

  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');

  // Register other tasks
  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', ['mochaTest:server', 'mochaTest:all']);
  grunt.registerTask('build', ['test', 'compress']);
  grunt.registerTask('deploy', ['build', 'aws_s3']);
  grunt.registerTask('start', ['build', 'shell:start']);
};
