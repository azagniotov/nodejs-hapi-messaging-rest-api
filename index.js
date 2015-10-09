var hapiServer = require('./server/server');
var server = hapiServer.listen(3000);
server.start(function () {
    console.log('Server running at:', server.info.uri);
});