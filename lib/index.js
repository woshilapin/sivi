var server = require("./server");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.servefile;
handle["/index.html"] = requestHandlers.servefile;
handle["/css/bootstrap.min.css"] = requestHandlers.servefile;
handle["/js/jquery-2.1.1.min.js"] = requestHandlers.servefile;
handle["/js/cv.js"] = requestHandlers.servefile;
handle["/submit"] = requestHandlers.submit;

server.start(handle);
