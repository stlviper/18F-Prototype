var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var qs = require("querystring");

var indexService = indexService || {};

indexService.home = {
	get: function(request, response){
		var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);

		var contentTypesByExtension = {
			'.html': "text/html",
			'.css': "text/css",
			'.js': "text/javascript"
		};

		filename += '../public';

		fs.exists(filename, function(exists){
			if (!exists){
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not Found\n");
				response.end();
				return;
			}

			if (fs.statSync(filename).isDirectory()) filename += '/index.html';

			fs.readFile(filename, "binary", function(err, file){
				if (err){
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err + "\n");
					response.end();
					return;
				}

				var headers = {};
				var contentType = contentTypesByExtension[ path.extname(filename) ];
				if (contentType) headers[ "Content-Type" ] = contentType;
				response.writeHead(200, headers);
				response.write(file, "binary");
				response.end();
			});
		});
	}
};

module.exports = indexService;