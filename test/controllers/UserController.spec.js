var expect = require('../test_helper').expect;

/* istanbul ignore next */
describe('user controller', function () {
    this.timeout(5000);

    var server, User;
    before(function (done) {
        var db = require(__main_root + 'db/DB.js');
        db.instance.sync().then(function () {
            server = require(__main_root + 'server/Server').listen();
            server.start(function () {
                User = require(__main_root + 'db/DB.js').models.user;
                done();
            });
        });
    });

    afterEach(function (done) {
        User.destroy({truncate: true, force: true}).then(function () {
            done();
        });
    });

    after(function (done) {
        User.sync({force: true}).then(function () {
            done();
        });
    });

    describe('createNewUser', function () {

        it("should fail to create new user when POSTed invalid JSON", function (done) {
            var options = {
                method: "POST",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                },
                payload: '{ "key": "not properly closed value }'
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(400);

                var error = JSON.parse(response.payload);
                expect(error.code).to.equal(400);
                expect(error.message).to.equal('400 Bad Request');
                expect(error.description).to.equal('The syntax of the request entity is incorrect');

                done();
            });
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
                expect(payload.data.attributes.email).to.equal('1@gmail.com');

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
        var authToken;
        beforeEach(function (done) {
            User.create({name: 'alex-wow', email: '1@gmail.com', password: '987654321'})
                .then(function (user) {
                    createUserId = user.id;
                    authToken = user.authToken;
                    done();
                });
        });

        it("should list user by id", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users/" + createUserId,
                headers: {
                    "content-type": "application/json",
                    "x-api-key": authToken
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(200);
                var payload = JSON.parse(response.payload);

                expect(payload.data.type).to.equal('users');
                expect(payload.data.attributes.name).to.equal('alex-wow');
                expect(payload.data.attributes.email).to.equal('1@gmail.com');
                done();
            });
        });

        it("should return 404 when trying to list user by non-existent id", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users/888",
                headers: {
                    "content-type": "application/json",
                    "x-api-key": authToken
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

        it("should return 401 when trying to list user by id with invalid auth token", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users/1",
                headers: {
                    "content-type": "application/json",
                    "x-api-key": "invalid_token_value"
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(401);

                var error = JSON.parse(response.payload);
                expect(error.code).to.equal(401);
                expect(error.message).to.equal('401 Unauthorized');
                expect(error.description).to.equal('Api key is not valid');

                done();
            });
        });

        it("should return 401 when trying to list user by id without auth token header", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users/1",
                headers: {
                    "content-type": "application/json"
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(401);

                var error = JSON.parse(response.payload);
                expect(error.code).to.equal(401);
                expect(error.message).to.equal('401 Unauthorized');
                expect(error.description).to.equal('X-Api-Key header is not set');

                done();
            });
        });

        it("should error when trying to list user by an invalid id", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users/abc",
                headers: {
                    "content-type": "application/json",
                    "x-api-key": authToken
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

    describe('listAllUsers', function () {

        var userOneAuthToken;
        before(function (done) {
            User.bulkCreate([
                {name: 'Alex1', email: 'alex1@gmail.com', password: '123456'},
                {name: 'Alex2', email: 'alex2@gmail.com', password: '654321'}
            ]).then(function (users) {
                userOneAuthToken = users[0].get({plain: true}).auth_token;
                done();
            });
        });

        it("should list all users", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json",
                    "x-api-key": userOneAuthToken
                }
            };

            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(200);
                var payload = JSON.parse(response.payload);

                expect(payload).to.have.property('data').with.length(2);

                expect(payload.data[0]).to.have.property('type').equal('users');
                expect(payload.data[1]).to.have.property('type').equal('users');

                expect(payload.data[0]).to.have.property('attributes').that.is
                    .an('object').eql({
                        'name': 'Alex1',
                        'email': 'alex1@gmail.com'
                    });
                expect(payload.data[1]).to.have.property('attributes').that.is
                    .an('object').eql({
                        'name': 'Alex2',
                        'email': 'alex2@gmail.com'
                    });

                done();
            });
        });

        it("should return 401 when trying to list all users with invalid auth token", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json",
                    "x-api-key": "invalid_token_value"
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(401);

                var error = JSON.parse(response.payload);
                expect(error.code).to.equal(401);
                expect(error.message).to.equal('401 Unauthorized');
                expect(error.description).to.equal('Api key is not valid');

                done();
            });
        });

        it("should return 401 when trying to list all users without auth token header", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/users",
                headers: {
                    "content-type": "application/json"
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(401);

                var error = JSON.parse(response.payload);
                expect(error.code).to.equal(401);
                expect(error.message).to.equal('401 Unauthorized');
                expect(error.description).to.equal('X-Api-Key header is not set');

                done();
            });
        });
    });
});