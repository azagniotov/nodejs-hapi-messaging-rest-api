var expect    = require('../test_helper').expect;

/* istanbul ignore next */
describe('root route', function () {
    var server, route;

    require(__project_root + 'app.js');
    var User = require(__main_root + 'db/DB.js').models.user;

    before(function (done) {
        User.sync({force: true}).then(function () {
            server = require(__project_root + 'app.js').server;
            route = server.lookup('root');
            done();
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
