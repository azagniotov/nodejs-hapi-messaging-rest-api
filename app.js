/* istanbul ignore next */
(function () {
    global.__project_root = __dirname + '/';
    global.__main_root = __project_root + 'main/';

    var sequelize = require(__main_root + 'db/Database.js').init("production");
    sequelize.sync({force: false}).then(function() {
        console.log('Database "' + sequelize.config.database + '" is up');

        var hapiServer = require(__main_root + 'server/Server');
        var server = hapiServer.listen();
        server.start(function () {
            console.log('Server running at:', server.info.uri);
        });
        module.exports = {server: server};
    });
})();
