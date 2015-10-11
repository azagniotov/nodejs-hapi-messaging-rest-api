/* istanbul ignore next */
(function () {
    global.__project_root = __dirname + '/';
    global.__main_root = __project_root + 'main/';
    var hapiServer = require(__main_root + 'server/Server');
    var server = hapiServer.listen();
    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
    module.exports = {server: server};


    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(':memory:');

    db.serialize(function() {

        db.run("CREATE TABLE if not exists user_info (info TEXT)");
        var stmt = db.prepare("INSERT INTO user_info VALUES (?)");
        for (var i = 0; i < 10; i++) {
            stmt.run("Ipsum " + i);
        }
        stmt.finalize();

        db.each("SELECT rowid AS id, info FROM user_info", function(err, row) {
            console.log(row.id + ": " + row.info);
        });
    });

    db.close();

})();
