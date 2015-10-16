var expect    = require('../test_helper').expect;

/* istanbul ignore next */
describe('sessions route', function () {

    var server, route;
    before(function (done) {
        var db = require(__main_root + 'db/DB.js');
        db.instance.sync().then(function () {
            server = require(__main_root + 'server/Server').listen();
            server.start(function () {
                route = server.lookup('authenticate_user_with_basic');
                done();
            });
        });
    });

    it("should not be null", function(done) {
        expect(route).to.not.be.null;
        done();
    });

    it("should have expected path", function(done) {
        expect(route.path).to.equal('/api/v1/sessions');
        done();
    });

    it("should have expected method", function(done) {
        expect(route.method).to.equal('get');
        done();
    });

    it("should have expected description", function(done) {
        expect(route.settings.description).to.equal('Authenticate user with Basic Authentication');
        done();
    });

    it("responds with status code 401 when Basic authentication header is not set", function (done) {
        var options = {method: "GET", url: "/api/v1/sessions"};
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(401);
            done();
        });
    });
});
