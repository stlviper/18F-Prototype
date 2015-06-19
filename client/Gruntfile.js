module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		mochaTest: {
			client: {
				src: ['test/**/*.js'],
				options: {
					reporter: 'nyan'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-mocha-test');

	// Register other tasks
	grunt.registerTask('test', [ 'mochaTest:client' ]);
	grunt.registerTask('default', ['test']);

};
