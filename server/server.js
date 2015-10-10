var Hapi = require("hapi");
var data = require("../db/fixtures/data");
var routes = require("./routes");

function listen(port) {
    var server = new Hapi.Server();
    server.connection({
        host: 'localhost',
        port: port
    });

    server.route(routes);
    return server;
}
module.exports = {listen: listen};