function listen() {
    var Hapi = require('hapi');
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

    return server;
}
module.exports = {listen: listen};