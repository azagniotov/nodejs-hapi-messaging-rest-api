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

    it("responds with status code 200 and hello world text", function (done) {
        var options = {method: "GET", url: "/"};
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            expect(response.payload).to.not.be.null;
            done();
        });
    });
});


