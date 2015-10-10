function listen(port) {
    var Hapi = require("hapi");
    var rootRoute = require("../routes/RootRoute.js");
    var dataRoute = require("../routes/api/v1/DataRoute.js");
    var server = new Hapi.Server();
    server.connection({
        host: 'localhost',
        port: port
    });

    server.route([rootRoute, dataRoute]);
    module.exports.routingTable = server.table('localhost')[0].table;

    return server;
}
module.exports = {listen: listen};