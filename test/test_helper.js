global.__project_root = __dirname + '/../';
global.__main_root = __project_root + 'main/';

var expect = require("chai").expect;
var should = require("chai").should;
var assert = require("chai").assert;

module.exports = {expect: expect, should: should, assert: assert};