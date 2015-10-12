/* istanbul ignore next */
(function () {
    var Sequelize = require('sequelize');
    var User = __db.define('user', {
            name: {
                type: Sequelize.STRING,
                field: 'name'
            },
            email: {
                type: Sequelize.STRING,
                field: 'email'
            },
            password: {
                type: Sequelize.STRING,
                field: 'password'
            }
        },
        {
            freezeTableName: true
        });
    module.exports = User;
})();