var expect = require('../test_helper').expect;
var assert = require('../test_helper').assert;

/* istanbul ignore next */
describe('sessions route', function () {

    var server, route;
    before(function (done) {
        var db = require(__main_root + 'db/DB.js');
        db.instance.sync().then(function () {
            server = require(__main_root + 'server/Server').listen();
            server.start(function () {
                route = server.lookup('get_authorization_token_using_basic_auth');
                done();
            });
        });
    });

    describe('get authorization token using basic auth route', function () {
        it("should not be null", function (done) {
            expect(route).to.not.be.null;
            done();
        });

        it("should have expected path", function (done) {
            expect(route.path).to.equal('/api/v1/sessions');
            done();
        });

        it("should have expected method", function (done) {
            expect(route.method).to.equal('get');
            done();
        });

        it("should have expected description", function (done) {
            expect(route.settings.description).to.equal('Authenticate user with Basic Authentication');
            done();
        });

        it("should have expected handler function", function (done) {
            assert.isFunction(route.settings.handler);
            expect(route.settings.handler.name).to.equal('authenticateUserWithBasic');
            done();
        });
    });
});
