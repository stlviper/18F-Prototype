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
					script: 'main.js'
				}
			},
			prod: { // TODO: decide where prod is
				options: {
					script: 'main.js',
					node_env: 'production'
				}
			},
			test: {
				options: {
					script: 'main.js'
				}
			}
		},
		mochaTest: {
			server: {
				src: ['test/**/*.js'],
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
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-express-server');

	// Register other tasks
	grunt.registerTask('test', [ 'express:dev', 'mochaTest:server' ]);
	grunt.registerTask('default', ['test']);

};
