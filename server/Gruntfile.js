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
			client: {
				src: ['public/test/**/*.js'],
				options: {
					reporter: 'nyan'
				}
			},
			all: {
				src: ['test/app/**/*.js', 'test/public/**/*.js' ],
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
					archive: '../build/openfdaviz-server.zip'
				},
				files: [
					{src: ['**', '!node_modules/**'], dest: '/', filter: 'isFile'}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-contrib-compress');

	// Register other tasks
	grunt.registerTask('test', [ 'express:dev', 'mochaTest:server' ]);
	grunt.registerTask('default', ['test']);

};
