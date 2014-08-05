var http = require("http");
var url = require("url");

var start = module.exports.start = function(handle) {
	var onRequest = function(request, response) {
		var data = "";
		var pathname = url.parse(request.url).pathname;

		request.setEncoding("utf8");

		request.addListener("data", function(dataChunk) {
			data += dataChunk;
		});
		request.addListener("end", function() {
			console.log('Handling a request for [' + pathname + ']');
			if (typeof handle[pathname] === 'function') {
				handle[pathname](request, response, data);
			} else {
				console.log('Page not found.');
				response.writeHead(404, {"Content-Type": "text/plain"});
				response.write("404 Not found");
				response.end();
			}
		});
	};
	http.createServer(onRequest).listen(8888);
	console.log("Server has started");
}
