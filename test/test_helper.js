global.__project_root = __dirname + '/../';
global.__main_root = __project_root + 'main/';

var expect = require("chai").expect;
var should = require("chai").should;

function destroy(Sequelize, SequelizeModel, asyncDone) {
    "use strict";
    SequelizeModel.destroy({
        truncate: true,
        force: true
    }).then(function (affectedRows) {
        //console.warn("Deleted " + affectedRows + " rows in table '" + SequelizeModel + "'");

        Sequelize.query("DELETE FROM SQLITE_SEQUENCE WHERE name='" + SequelizeModel.name + "'",
            {type: Sequelize.QueryTypes.DELETE}).then(function () {
                //console.warn("Deleted from 'SQLITE_SEQUENCE' where table name is '" + SequelizeModel.name + "'");
                asyncDone();
            });
    })
}

module.exports = {expect: expect, should: should, destroy: destroy};