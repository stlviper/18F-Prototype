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
						dest: 'client/',
						action: 'delete'
					},
					{
						expand: true,
						cwd: 'dist/client/',
						src: ['**'],
						dest: '/client/',
						params: { CacheControl: '1000' }
					}
				]
			}
		},
		clean: {
			client: ['dist/client'],
			server: ['dist/server']
		},
		shell: {
			foreverInstall: {
				command: 'npm install -g forever'
			},
			npmInstallClient: {
				command: 'cd client && npm install'
			},
			npmInstallServer: {
				command: 'cd server && npm install'
			},
			startClient: {
				command: 'forever start client/test/mockserver/mockserver_prod.js'
			},
			startServer: {
				command: 'PORT=3002 forever start server/app.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-aws-s3');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-shell');

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
	grunt.registerTask('setup:client', ['shell:npmInstallClient']);
	grunt.registerTask('setup:server', ['shell:npmInstallServer']);
	grunt.registerTask('deploy:client', ['clean:client', 'deploysubproject:client', 'aws_s3:production']);
	grunt.registerTask('deploy:server', ['clean:server', 'deploysubproject:server']);
	grunt.registerTask('deploy', ['deploy:client', 'deploy:server']);
	grunt.registerTask('start', ['setup:client', 'setup:server', 'clean:client', 'deploysubproject:client', 'clean:server', 'deploysubproject:server',
			'shell:foreverInstall', 'shell:startClient', 'shell:startServer']);
};