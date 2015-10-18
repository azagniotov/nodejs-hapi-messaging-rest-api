"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            field: 'name',
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            field: 'email',
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            field: 'password',
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING,
            field: 'salt'
        },
        authToken: {
            type: DataTypes.STRING,
            field: 'auth_token'
        }
    }, {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        indexes: [{
            name: 'user_auth_token',
            method: 'BTREE',
            fields: ['auth_token']
        }, {
            name: 'user_email',
            method: 'BTREE',
            fields: ['email']
        }],
        classMethods: {
            authenticate: function (email, password, callback) {
                this.findOne({where: {email: email}}).then(function (foundUser) {
                    if (!foundUser || foundUser === null) {
                        callback(false, null);
                    } else {
                        var bcrypt = require('bcrypt-nodejs');
                        var authenticated = bcrypt.compareSync(password, foundUser.password);
                        callback(authenticated, (authenticated === false ? null : foundUser.authToken));
                    }
                });
            }
        },
        hooks: {
            beforeCreate: function (user, options) {
                var uuid = require('node-uuid');
                user.authToken = uuid.v4().replace(/-/g, '');

                var bcrypt = require('bcrypt-nodejs');
                user.salt = bcrypt.genSaltSync(10);
                user.password = bcrypt.hashSync(user.password, user.salt);
            },
            beforeBulkCreate: function (users) {
                var uuid = require('node-uuid');
                var bcrypt = require('bcrypt-nodejs');
                users.forEach(function (user) {
                    user.authToken = uuid.v4().replace(/-/g, '');
                    user.salt = bcrypt.genSaltSync(10);
                    user.password = bcrypt.hashSync(user.password, user.salt);
                });
            }
        }
    });
};