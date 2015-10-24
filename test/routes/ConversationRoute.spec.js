var expect = require('../test_helper').expect;
var assert = require('../test_helper').assert;

/* istanbul ignore next */
describe('conversation route', function () {

    var server;
    before(function (done) {
        var db = require(__main_root + 'db/DB.js');
        db.instance.sync().then(function () {
            server = require(__main_root + 'server/Server').listen();
            done();
        });
    });

    describe('create new conversation route', function () {
        var route;
        before(function (done) {
            route = server.lookup('create_new_conversation');
            done();
        });

        it("should not be null", function (done) {
            expect(route).to.not.be.null;
            done();
        });

        it("should have expected path", function (done) {
            expect(route.path).to.equal('/api/v1/conversations');
            done();
        });

        it("should have expected method", function (done) {
            expect(route.method).to.equal('post');
            done();
        });

        it("should have expected description", function (done) {
            expect(route.settings.description).to.equal('Creates new conversation');
            done();
        });

        it("should have expected handler function", function (done) {
            assert.isFunction(route.settings.handler);
            expect(route.settings.handler.name).to.equal('createNewConversation');
            done();
        });
    });
});
