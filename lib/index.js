var server = require("./server");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.servefile;
handle["/index.html"] = requestHandlers.servefile;
handle["/css/bootstrap.min.css"] = requestHandlers.servefile;
handle["/js/jquery.min.js"] = requestHandlers.servefile;
handle["/js/angular.min.js"] = requestHandlers.servefile;
handle["/js/cv.js"] = requestHandlers.servefile;
handle["/submit"] = requestHandlers.submit;

server.start(handle);
