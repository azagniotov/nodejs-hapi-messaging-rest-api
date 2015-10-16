var expect = require('../test_helper').expect;
var Sequelize = require('../test_helper').Sequelize;

/* istanbul ignore next */
describe('sessions controller', function () {
    this.timeout(5000);

    require(__project_root + 'app.js');
    var User = require(__main_root + 'db/DB.js').models.user, server;

    before(function (done) {
        User.sync({force: true}).then(function () {
            server = require(__project_root + 'app.js').server;
            done();
        });
    });

    afterEach(function (done) {
        User.sync({force: true}).then(function () {
            done();
        });
    });

    describe('authenticateUserWithBasic', function () {

        var email = "something@yahoo.com";
        var password = "987654321";

        beforeEach(function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                },
                payload: {
                    "user": {"email": email, "password": password, "name": "alex-wow"}
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(201);
                done();
            });
        });


        it("should authenticate user when Basic header is set", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/sessions",
                headers: {
                    authorization: 'Basic ' + (new Buffer(email + ':' + password, 'utf8')).toString('base64')
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(200);
                var payload = JSON.parse(response.payload);

                expect(payload.auth_token).to.have.length.of.at.least(32);
                expect(payload.email).to.equal(email);
                done();
            });
        });
    });
});