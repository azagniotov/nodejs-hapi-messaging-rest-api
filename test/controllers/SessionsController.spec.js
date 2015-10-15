var expect = require('../test_helper').expect;

/* istanbul ignore next */
describe('sessions controller', function () {
    this.timeout(5000);

    var sequelize, server, User;
    before(function (done) {
        sequelize = require(__main_root + 'db/Database.js').init("session_controller", true);
        sequelize.sync({force: true}).then(function () {
            var hapiServer = require(__main_root + 'server/Server');
            server = hapiServer.listen();
            server.start(function () {
                User = global.__models.User;
                done();
            });
        });
    });

    describe('authenticateUserWithBasic', function () {

        beforeEach(function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                },
                payload: {
                    "user": {"email": "1@gmail.com", "password": "987654321", "name": "alex-wow"}
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(201);
                done();
            });
        });

        afterEach(function (done) {
            User.destroy({
                where: {email: '1@gmail.com'},
                force: true
            }).then(function (affectedRows) {
                done();
            })
        });

        it("should authenticate user when Basic header is set", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/sessions",
                headers: {
                    authorization: 'Basic ' + (new Buffer('1@gmail.com:987654321', 'utf8')).toString('base64')
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(200);
                var payload = JSON.parse(response.payload);

                expect(payload.auth_token).to.have.length.of.at.least(32);
                expect(payload.email).to.equal('1@gmail.com');
                done();
            });
        });
    });
});