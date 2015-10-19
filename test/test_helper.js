global.__project_root = __dirname + '/../';
global.__main_root = __project_root + 'main/';

var expect = require("chai").expect;
var should = require("chai").should;
var assert = require("chai").assert;

function drop(Model, asyncDone) {
    "use strict";
    Model.sync({force: true}).then(function () {
        if (asyncDone !== null) {
            asyncDone();
        }
    });
}

function truncate(Model, asyncDone) {
    "use strict";
    Model.destroy({truncate: true, force: true}).then(function () {
        if (asyncDone !== null) {
            asyncDone();
        }
    });
}

module.exports = {expect: expect, should: should, assert: assert, drop: drop, truncate: truncate};