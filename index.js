/* istanbul ignore next */
(function () {
    var hapiServer = require('./src/server/Server');
    var server = hapiServer.listen(3000);
    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
})();