/* istanbul ignore next */
(function () {
    var hapiServer = require('./server/server');
    var server = hapiServer.listen(3000);
    server.start(function () {
        console.log('Server running at:', server.info.uri);
        //var table = server.table('localhost');
        //console.log(table[0].table[0].method + " " + table[0].table[0].path);
        //console.log(table[0].table[1].method + " " + table[0].table[1].path);
    });
})();