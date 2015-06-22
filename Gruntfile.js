module.exports = function(grunt) {
	grunt.initConfig({
		aws: grunt.file.readJSON('aws.json'),
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
					{
						dest: 'client/', action: 'delete'
					},
					{
						expand: true,
						cwd: 'dist/client/',
						src: ['**'],
						dest: '/client/'
					}
				]
			}
		},
		clean: {
			client:{
				dev: ['dist/client']
			},
			server:{
				dev: ['dist/server']
			}
		}
	});

	grunt.loadNpmTasks('grunt-aws-s3');
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
	grunt.registerTask('deploy:client', ['clean:client', 'deploysubproject:client', 'aws_s3:production']);
	grunt.registerTask('deploy:server', ['clean:server', 'deploysubproject:server']);
	grunt.registerTask('deploy', ['deploy:client', 'deploy:server']);
};