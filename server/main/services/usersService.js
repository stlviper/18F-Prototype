var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var qs = require("querystring");

var usersService = usersService || {};

usersService.users = {
	get: function(request, response){
		var testContent = {
			'users': []
		};

		response.json(testContent);
	}
};

module.exports = usersService;