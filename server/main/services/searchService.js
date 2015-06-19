var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var qs = require("querystring");

var searchService = searchService || {};

searchService.query = {
	get: function(request, response){
		var testContent = {
			'results': []
		};

		response.json(testContent);;
	}
};

module.exports = searchService;