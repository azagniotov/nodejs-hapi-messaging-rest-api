function listen(databaseHost) {
    var Hapi = require('hapi');
    require(__main_root + 'db/Database.js').init(databaseHost);

    var rootRoute = require(__main_root + 'routes/RootRoute.js');
    var dataRoutes = require(__main_root + 'routes/api/v1/DataRoute.js');
    var userRoutes = require(__main_root + 'routes/api/v1/UserRoute.js');

    var server = new Hapi.Server();
    server.connection({
        host: process.env.npm_package_config_host,
        port: process.env.npm_package_config_port
    });

    server.route([rootRoute].concat(dataRoutes, userRoutes));
    module.exports.routingTable = server.table(process.env.npm_package_config_host)[0].table;

    server.ext('onPreResponse', function (request, reply) {
        var response = request.response;
        if (response.isBoom && response.output.statusCode === 400 && response.data.name === 'SyntaxError') {
            response.output.payload = {
                "code": 400,
                "message": "400 Bad Request",
                "description": "The syntax of the request entity is incorrect"
            };
        }
        return reply.continue();
    });

    return server;
}
module.exports = {listen: listen};