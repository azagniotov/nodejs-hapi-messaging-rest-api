var hapi_server = require('./server/server.js');
var port = 3000;
var server = hapi_server.createServer(port);

server.start(function () {
    console.log('Server running at:', server.info.uri);
});