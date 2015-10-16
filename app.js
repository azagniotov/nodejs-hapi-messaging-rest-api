/* istanbul ignore next */
(function () {
    global.__project_root = __dirname + '/';
    global.__main_root = __project_root + 'main/';

    var db = require(__main_root + 'db/DB.js');
    db.instance.sync().then(function () {
        var hapiServer = require(__main_root + 'server/Server');
        var server =  hapiServer.listen();
        server.start(function () {
            console.log('Server running at:', server.info.uri);
            module.exports = {server: server};
        });
    });
})();
