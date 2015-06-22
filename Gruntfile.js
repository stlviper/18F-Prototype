module.exports = function(grunt) {
	grunt.initConfig({
		clean: {
			client:{
				dev: ['dist/client']
			},
			server:{
				dev: ['dist/server']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('deploysubproject:client', function (){
		var done = this.async();
		grunt.util.spawn({
			grunt: true,
			args: ['deploy'],
			opts: {
				cwd: 'client'
			}
		}, function (err, result, code) {
			done();
		});

	});
	grunt.registerTask('deploysubproject:server', function (){
		var done = this.async();
		grunt.util.spawn({
			grunt: true,
			args: ['deploy'],
			opts: {
				cwd: 'server'
			}
		}, function (err, result, code) {
			done();
		});
	});
	grunt.registerTask('deploy:client', ['clean:client', 'deploysubproject:client']);
	grunt.registerTask('deploy:server', ['clean:server', 'deploysubproject:server']);
	grunt.registerTask('deploy', ['deploy:client', 'deploy:server']);
};