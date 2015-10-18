var expect = require('../test_helper').expect;
var assert = require('../test_helper').assert;

/* istanbul ignore next */
describe('message route', function () {

    var server;
    before(function (done) {
        var db = require(__main_root + 'db/DB.js');
        db.instance.sync().then(function () {
            server = require(__main_root + 'server/Server').listen();
            done();
        });
    });

    describe('list message by id route', function () {
        var route;
        before(function (done) {
            route = server.lookup('list_message_by_id');
            done();
        });

        it("should not be null", function (done) {
            expect(route).to.not.be.null;
            done();
        });

        it("should have expected path", function (done) {
            expect(route.path).to.equal('/api/v1/messages/{message_id}');
            done();
        });

        it("should have expected method", function (done) {
            expect(route.method).to.equal('get');
            done();
        });

        it("should have expected description", function (done) {
            expect(route.settings.description).to.equal('List message by id');
            done();
        });

        it("should have expected handler function", function (done) {
            assert.isFunction(route.settings.handler);
            expect(route.settings.handler.name).to.equal('listMessageById');
            done();
        });
    });
});
