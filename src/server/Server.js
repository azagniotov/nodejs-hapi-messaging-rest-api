var Hapi = require("hapi");
var rootRoute = require("../routes/RootRoute.js");
var dataRoute = require("../routes/api/v1/DataRoute.js");

function listen(port) {
    var server = new Hapi.Server();
    server.connection({
        host: 'localhost',
        port: port
    });

    server.route([rootRoute, dataRoute]);
    return server;
}
module.exports = {listen: listen};