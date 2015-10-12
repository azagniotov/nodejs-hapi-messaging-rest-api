/* istanbul ignore next */
(function () {
    var Sequelize = require('sequelize');
    var db = new Sequelize('messaging', null, null, {
        host: 'localhost',
        dialect: 'sqlite',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        // SQLite only 
        storage: __main_root + 'db/nodejs-hapi-messaging-rest-api.sqlite3'
    });
    global.__db = db;

    var User = require(__main_root + 'models/User.js');
    User.sync({force: false});
})();
