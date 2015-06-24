exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['tests/home/homepage.js',
		'tests/map/mapFeatures.js',
		'tests/nav/navWorkflow.js']
};