'use strict';

var fs = require('fs');
var environment = process.env.NODE_ENV;

var config = require(__main_root + 'config/database.js')[environment];
var Sequelize = require('sequelize');
var sequelizeInstance = new Sequelize(config.database, config.username, config.password, config);
var db = {models: {}};

fs.readdirSync(__main_root + 'models/')
    .filter(function (file) {
        return (file.indexOf('.') !== 0);
    }).forEach(function (file) {
        var model = sequelizeInstance.import(__main_root + 'models/' + file);
        db.models[model.name] = model;
    });

db.instance = sequelizeInstance;

module.exports = db;