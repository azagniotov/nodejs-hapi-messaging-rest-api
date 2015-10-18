var expect = require('../test_helper').expect;
var assert = require('../test_helper').assert;

/* istanbul ignore next */
describe('root route', function () {

    var server, route;
    before(function (done) {
        var db = require(__main_root + 'db/DB.js');
        db.instance.sync().then(function () {
            server = require(__main_root + 'server/Server').listen();
            server.start(function () {
                route = server.lookup('root');
                done();
            });
        });
    });

    it("should not be null", function (done) {
        expect(route).to.not.be.null;
        done();
    });

    it("should have expected path", function (done) {
        expect(route.path).to.equal('/');
        done();
    });

    it("should have expected method", function (done) {
        expect(route.method).to.equal('get');
        done();
    });

    it("should have expected description", function (done) {
        expect(route.settings.description).to.equal('Gets all of the endpoint categories that the API supports');
        done();
    });

    it("should have expected handler function", function (done) {
        assert.isFunction(route.settings.handler);
        expect(route.settings.handler.name).to.equal('apiDiscovery');
        done();
    });
});
