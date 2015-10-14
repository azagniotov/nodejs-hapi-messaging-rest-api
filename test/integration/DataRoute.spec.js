var expect    = require('../test_helper').expect;

describe('data route', function () {
    var server;

    before(function (done) {
        var sequelize = require(__main_root + 'db/Database.js').init("test_integration");
        sequelize.sync({force: false}).then(function () {
            var hapiServer = require(__main_root + 'server/Server');
            server = hapiServer.listen();
            server.start(function () {
                done();
            });
        });
    });

    it('responds with 404 - Not Found', function (done) {
        var options = {method: 'GET', url: '/api/v1/data/2'};
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(404);
            expect(response.result).to.equal('Not Found');
            done();
        });
    });

    it('responds with Bad Request when param is invalid', function (done) {
        var options = {method: 'GET', url: '/api/v1/data/two'};
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(400);

            var error = JSON.parse(response.payload);
            expect(error.statusCode).to.equal(400);
            expect(error.error).to.equal('Bad Request');
            done();
        });
    });
});
