var expect = require('../test_helper').expect;
var destroy = require('../test_helper').destroy;

/* istanbul ignore next */
describe('controller', function () {
    this.timeout(5000);

    var sequelize, server, User;
    before(function (done) {
        sequelize = require(__main_root + 'db/Database.js').init("test_controllers", false);
        sequelize.sync({force: false}).then(function () {
            var hapiServer = require(__main_root + 'server/Server');
            server = hapiServer.listen();
            server.start(function () {
                User = global.__models.User;
                done();
            });
        });
    });

    describe('createNewUser', function () {

        afterEach(function (done) {
            destroy(sequelize, User, done);
        });

        it("should create new user on successful POST", function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                },
                payload: {
                    "user": {"email": "1@gmail.com", "password": "123456", "name": "alex"}
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(201);

                var payload = JSON.parse(response.payload);
                expect(payload.data.type).to.equal('users');
                expect(payload.data.id).to.equal('1');

                done();
            });
        });

        it("should respond with an error when required param is not POSTed", function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                },
                payload: {
                    "user": {"email": "1@gmail.com", "password": "123456"}
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(422);

                var error = JSON.parse(response.payload);
                expect(error.code).to.equal(422);
                expect(error.message).to.equal('422 Unprocessable Entity');
                expect(error.description).to.equal('The server was unable to process the Request payload: "name" is required');

                done();
            });
        });

        it("should respond with an error when unexpected param is POSTed", function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                },
                payload: {
                    "user": {"name": "alex", "unexpected": "param", "email": "1@gmail.com", "password": "123456"}
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(422);

                var error = JSON.parse(response.payload);
                expect(error.code).to.equal(422);
                expect(error.message).to.equal('422 Unprocessable Entity');
                expect(error.description).to.equal('The server was unable to process the Request payload: "unexpected" is not allowed');

                done();
            });
        });

        it("should respond with an error when wrong content-type header is set", function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/xml"
                },
                payload: {
                    "user": {"name": "alex", "email": "1@gmail.com", "password": "123456"}
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(415);
                done();
            });
        });

        it("should respond with an error when the same user details are double-POSTed", function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                },
                payload: {
                    "user": {"name": "alex-yay", "email": "1@gmail.com", "password": "123456"}
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(201);

                server.inject(options, function (response) {
                    expect(response.statusCode).to.equal(409);

                    var error = JSON.parse(response.payload);
                    expect(error.code).to.equal(409);
                    expect(error.message).to.equal('409 Conflict');
                    expect(error.description).to.equal('User with email \'1@gmail.com\' is already registered');

                    done();
                });
            });
        });
    });

    describe('listUserById', function () {

        var createUserId;

        beforeEach(function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                },
                payload: {
                    "user": {"email": "1@gmail.com", "password": "123456", "name": "alex-wow"}
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(201);
                var payload = JSON.parse(response.payload);
                createUserId = payload.data.id;
                done();
            });
        });

        afterEach(function (done) {
            destroy(sequelize, User, done);
        });

        it("should list user by id", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users/" + createUserId,
                headers: {
                    "content-type": "application/json"
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(200);
                var payload = JSON.parse(response.payload);

                expect(payload.data.type).to.equal('users');
                expect(payload.data.id).to.equal('1');
                done();
            });
        });

        it("should return 404 when trying to list user by non-existent id", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users/888",
                headers: {
                    "content-type": "application/json"
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(404);

                var error = JSON.parse(response.payload);
                expect(error.code).to.equal(404);
                expect(error.message).to.equal('404 Not Found');
                expect(error.description).to.equal('User with id \'888\' does not exist');

                done();
            });
        });

        it("should error when trying to list user by an invalid id", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users/abc",
                headers: {
                    "content-type": "application/json"
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(422);

                var error = JSON.parse(response.payload);
                expect(error.code).to.equal(422);
                expect(error.message).to.equal('422 Unprocessable Entity');
                expect(error.description).to.contain('"user_id" with value "abc" fails to match the required pattern');

                done();
            });
        });
    });
});