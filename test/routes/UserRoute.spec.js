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

        it("responds with 201 on successful POST", function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                },
                payload: {
                    "user": {"email": "1@gmail.com", "password": "123456", "name": "alex"}
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(201);
                done();
            });
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

        it("responds with 401 when no API key is set", function (done) {
            var options = {
                method: "GET",
                url: "/api/v1/users/888",
                headers: {
                    "content-type": "application/json"
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(401);
                done();
            });
        });
    });
});
