/* istanbul ignore next */
(function () {
    var hapiServer = require('./server/server');
    var server = hapiServer.listen(3000);
    server.start(function () {
        console.log('Server running at:', server.info.uri);
        var table = server.table('localhost');
        var route = table[0].table[1];
        //console.log(route.settings.id + ", " + route.method + ", " + route.path + ", " + route.settings.description);
    });
})();