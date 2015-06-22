module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
				files: [{
					expand: true,
					cwd: '../build/',
					src: ['**'],
					dest: '/'
				}]
			}
		},
		browserify: {
			options: {
				debug: true
			},
			pkg: grunt.file.readJSON('package.json'),
			npm:{
				src: 'build/lib/npm-lib.js',
				dest: '../dist/client/js/lib/npm-lib.js'
			}
		},
		clean: {
			dev: ['css'],
			prod: ['build/tmp']
		},
		concat: {
			js: {
				src: 'js/**/*.js',
				dest: 'build/tmp/src.js'
			}
		},
		copy: {
			prodIndex:{
				files: [{
					src: ['build/resources/index_prod.html'],
					dest: '../dist/client/index.html'
				}]
			},
			devIndex:{
				files: [{
					src: ['build/resources/index_dev.html'],
					dest: 'index.html'
				}]
			},
			vendorCss:{
				files: [{
					src: ['node_modules/bootstrap/dist/css/bootstrap.min.css'],
					dest: '../dist/client/css/bootstrap.min.css'
				}]
			}
		},
		jshint: {
			files: ['js/**/*.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		mochaTest: {
			client: {
				src: ['test/**/*.js'],
				options: {
					reporter: 'nyan'
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
			dev:{
				files: [{
					'css/openfdaviz.css': 'sass/*.scss'
				}]
			},
			dist: {
				files: [{
					'../dist/client/css/openfdaviz.css': 'sass/*.scss'
				}]
			}
		},
		shell: {
			s3deploy: {
				command: 'echo "(aws s3 cp dist/ :openfdaviz/)"'
			}
		},
		uglify: {
			src: {
				files: [
					{
						expand: true,
						cwd: './build/tmp/',
						src: [ '*.js' ],
						dest: '../dist/client/js/',
						ext: '.min.js'
					}
				]
			}
		},
		protractor_webdriver: {
			options: {

			},
			all: {
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-mocha-test');

	//to install, run npm install -g protractor, to start, first run webdriver-manager start --standalone
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-protractor-webdriver');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-shell');

	// Register other tasks
	grunt.registerTask('test', [ 'mochaTest:client' ]);
	grunt.registerTask('selenium', [ 'protractor:run' ]);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', ['sass:dev', 'copy:devIndex', 'browserify', 'test']);
	grunt.registerTask('build:prod', ['build', 'sass:dist', 'concat:js', 'uglify', 'copy']);
	grunt.registerTask('deploy', ['clean', 'build:prod', 'shell:s3deploy']);

};
