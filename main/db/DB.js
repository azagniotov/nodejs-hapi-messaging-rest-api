"use strict";

var fs = require("fs");
var environment = process.env.NODE_ENV || "development";
var config = require(__main_root + 'config/database.js')[environment];
var Sequelize = require("sequelize");
var sequelizeInstance = new Sequelize(config.database, config.username, config.password, config);
var db = {};
db.models = {};

fs.readdirSync(__main_root + 'models/')
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    }).forEach(function (file) {
        var model = sequelizeInstance.import(__main_root + 'models/' + file);
        db.models[model.name] = model;
    });

/*
 Object.keys(db).forEach(function (modelName) {
 if ("associate" in db[modelName]) {
 db[modelName].associate(db);
 }
 });
 */

db.instance = sequelizeInstance;
db.Sequelize = Sequelize;

module.exports = db;