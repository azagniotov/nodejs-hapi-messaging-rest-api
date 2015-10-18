"use strict";

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('message', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            autoIncrement: true,
            primaryKey: true
        },
        senderId: {
            type: DataTypes.INTEGER,
            field: 'sender_id',
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT,
            field: 'text',
            allowNull: true
        }
    }, {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        indexes: [{
            name: 'message_sender_id',
            method: 'BTREE',
            fields: ['sender_id']
        }]
    });
};