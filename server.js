//---------------------------------------------------------------------------------
//- server
//---------------------------------------------------------------------------------
var http = require("http");
var file = require("./src/filehelper");
var fn = require('./src/fn');
var log = console.log;

var server;
exports.create = function(pipeline) {
    server = http.createServer(function(request, response) {
    if (fn.isApiCall(request)) {
      processApi(pipeline, request, response);
    }
    else {
      file.get(request, response);
    }
  });
  return server;
};

// exports.start = function(server) {
//   server.listen(port);
// };

// exports.startServer = function(pipeline) {
// exports.stopServer = function(pipeline) {
// log("Server running at port: " + port + "\nCTRL + SHIFT + C to shutdown");

function processApi(pipeline, request, response) {
  if (fn.hasBody(request.method)) {
    var body = '';
    request.on('data', function(chunk) { body += chunk.toString(); });
    request.on('end', function() {
      request.body = JSON.parse(body);
      pipeline.run(request, response);
    });
  }
  else {
    pipeline.run(request, response);
  }
}
