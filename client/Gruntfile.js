module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		browserify: {
			options: {
				debug: true
			},
			pkg: grunt.file.readJSON('package.json'),
			all:{
				src: 'js/app.js',
				dest: 'dist/js/openfdaviz.js'
			}
		},
		clean:{
			dev: ['css'],
			prod: ['dist']
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
		sass: {
			dev:{
				files: [{
					'css/openfdaviz.css': 'sass/*.scss'
				}]
			},
			dist: {
				files: [{
					'dist/css/openfdaviz.css': 'sass/*.scss'
				}]
			}
		},
		shell: {
			s3deploy: {
				command: 'echo "(aws s3 cp dist/ :openfdaviz/)"'
			}
		},
		uglify:{
			dynamicMappings: {
				files:[
					{
						expand: true,
						cwd: '/dist/',
						src: ['*.js'],
						dest: './dist/min/',
						ext: '.min.js'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Register other tasks
	grunt.registerTask('test', [ 'mochaTest:client' ]);
	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', ['sass:dev', 'test']);
	grunt.registerTask('build:prod', ['build', 'sass:dist', 'browserify']);
	grunt.registerTask('deploy', ['clean', 'build:prod', 'shell:s3deploy']);

};
