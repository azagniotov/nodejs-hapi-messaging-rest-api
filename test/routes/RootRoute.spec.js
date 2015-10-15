var expect    = require('../test_helper').expect;

/* istanbul ignore next */
describe('root route', function () {
    var server, route;
    before(function (done) {
        var sequelize = require(__main_root + 'db/Database.js').init("test_root_route", false);
        sequelize.sync({force: true}).then(function () {
            var hapiServer = require(__main_root + 'server/Server');
            server = hapiServer.listen();
            server.start(function () {
                route  = server.lookup('root');
                done();
            });
        });
    });

    it("should not be null", function(done) {
        expect(route).to.not.be.null;
        done();
    });

    it("should have expected path", function(done) {
        expect(route.path).to.equal('/');
        done();
    });

    it("should have expected method", function(done) {
        expect(route.method).to.equal('get');
        done();
    });

    it("should have expected description", function(done) {
        expect(route.settings.description).to.equal('Gets all of the endpoint categories that the API supports');
        done();
    });

    it("responds with status code 200 and hello world text", function (done) {
        var options = {method: "GET", url: "/"};
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            expect(response.payload).to.not.be.null;
            done();
        });
    });
});
