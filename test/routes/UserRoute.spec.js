var expect = require('../test_helper').expect;

/* istanbul ignore next */
describe('user route', function () {

    var server;
    before(function (done) {
        var db = require(__main_root + 'db/DB.js');
        db.instance.sync().then(function () {
            server = require(__main_root + 'server/Server').listen();
            done();
        });
    });

    describe('create new user route', function () {
        var route;
        before(function (done) {
            route = server.lookup('create_new_user');
            done();
        });

        it("should not be null", function (done) {
            expect(route).to.not.be.null;
            done();
        });

        it("should have expected path", function (done) {
            expect(route.path).to.equal('/api/v1/users');
            done();
        });

        it("should have expected method", function (done) {
            expect(route.method).to.equal('post');
            done();
        });

        it("should have expected description", function (done) {
            expect(route.settings.description).to.equal('Creates new user');
            done();
        });
    });

    describe('list user by id route', function () {
        var route;
        before(function (done) {
            route = server.lookup('list_user_by_id');
            done();
        });

        it("should not be null", function (done) {
            expect(route).to.not.be.null;
            done();
        });

        it("should have expected path", function (done) {
            expect(route.path).to.equal('/api/v1/users/{user_id}');
            done();
        });

        it("should have expected method", function (done) {
            expect(route.method).to.equal('get');
            done();
        });

        it("should have expected description", function (done) {
            expect(route.settings.description).to.equal('List user by id');
            done();
        });
    });
});
