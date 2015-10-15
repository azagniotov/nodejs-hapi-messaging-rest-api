/* istanbul ignore next */
function init(databaseHost, logging) {
    var Sequelize = require('sequelize');
    var db = new Sequelize(databaseHost, null, null, {
        host: 'localhost',
        dialect: 'sqlite',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        // SQLite only
        logging: logging === false ? false : console.log,
        storage: __main_root + 'db/' + databaseHost + '.sqlite3'
    });
    global.__models = {};
    global.__schemas = {};
    var User = require(__main_root + 'models/User.js').make(db);
    global.__models.User = User;

    return db;
}

module.exports = {init: init};
