var expect = require('../test_helper').expect;

/* istanbul ignore next */
describe('message controller', function () {
    this.timeout(5000);

    var server, Message, User;
    before(function (done) {
        var db = require(__main_root + 'db/DB.js');
        db.instance.sync().then(function () {
            server = require(__main_root + 'server/Server').listen();
            server.start(function () {
                Message = require(__main_root + 'db/DB.js').models.message;
                User = require(__main_root + 'db/DB.js').models.user;
                done();
            });
        });
    });

    describe('listMessageById', function () {

        var createUserId, authToken, createMessageId;
        before(function (done) {
            User.create({name: 'alex-wow', email: '1@gmail.com', password: '987654321'})
                .then(function (user) {
                    createUserId = user.id;
                    authToken = user.authToken;

                    Message.create({senderId: createUserId, text: 'This is a message that says hello'})
                        .then(function (message) {
                            createMessageId = message.id;
                            done();
                        });
                });
        });

        after(function (done) {
            Message.sync({force: true}).then(function () {
                User.sync({force: true}).then(function () {
                    done();
                });
            });
        });

        it("should list message by id", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/messages/" + createMessageId,
                headers: {
                    "content-type": "application/json",
                    "x-api-key": authToken
                }
            };
            server.inject(get_options, function (response) {
                expect(response.statusCode).to.equal(200);
                var payload = JSON.parse(response.payload);

                expect(payload.data.type).to.equal('messages');
                expect(payload.data.attributes.sender_id).to.equal(createUserId);
                expect(payload.data.attributes.text).to.equal('This is a message that says hello');
                done();
            });
        });

        it("should return 404 when trying to list message by non-existent id", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/messages/888",
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
                expect(error.description).to.equal('Message with id \'888\' does not exist');

                done();
            });
        });

        it("should return 401 when trying to list message by id with invalid auth token", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/messages/1",
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

        it("should return 401 when trying to list message by id without auth token header", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/messages/1",
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

        it("should error when trying to list message by an invalid id", function (done) {
            var get_options = {
                method: "GET",
                url: "/api/v1/messages/abc",
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
                expect(error.description).to.contain('"message_id" with value "abc" fails to match the required pattern');

                done();
            });
        });
    });
});