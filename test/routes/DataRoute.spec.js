var expect    = require('../test_helper').expect;

describe('data route', function () {
    var server, route;
    before(function (done) {
        var sequelize = require(__main_root + 'db/Database.js').init("test_routes");
        sequelize.sync({force: false}).then(function () {
            var hapiServer = require(__main_root + 'server/Server');
            server = hapiServer.listen();
            server.start(function () {
                route  = server.lookup('get_data_by_id');
                done();
            });
        });
    });

    it("should not be null", function(done) {
        expect(route).to.not.be.null;
        done();
    });

    it("should have expected path", function(done) {
        expect(route.path).to.equal('/api/v1/data/{id}');
        done();
    });

    it("should have expected method", function(done) {
        expect(route.method).to.equal('get');
        done();
    });

    it("should have expected description", function(done) {
        expect(route.settings.description).to.equal('Returns canned data response by id');
        done();
    });
});
