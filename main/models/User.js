/* istanbul ignore next */
function make(db) {
    var Sequelize = require('sequelize');
    var User = db.define('user', {
        name: {
            type: Sequelize.STRING,
            field: 'name',
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            field: 'email',
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            field: 'password',
            allowNull: false
        },
        salt: {
            type: Sequelize.STRING,
            field: 'salt'
        },
        authToken: {
            type: Sequelize.STRING,
            field: 'auth_token'
        }
    }, {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        indexes: [{
            name: 'user_auth_token',
            fields: ['auth_token']
        }],
        hooks: {
            beforeCreate: function (user, options) {
                var uuid = require('node-uuid');
                user.authToken = uuid.v4().replace(/-/g, '');

                var bcrypt = require('bcrypt-nodejs');
                user.salt = bcrypt.genSaltSync(10);
                user.password = bcrypt.hashSync(user.password, user.salt);
            }
        }
    });

    global.__models.User = User;
}

module.exports = {make: make};