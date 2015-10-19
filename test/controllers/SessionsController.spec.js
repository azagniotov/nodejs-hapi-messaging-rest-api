var expect = require('../test_helper').expect;
var drop = require('../test_helper').drop;

/* istanbul ignore next */
describe('sessions controller', function () {
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

    describe('authenticateUserWithBasic', function () {

        var email = "something@yahoo.com";
        var password = "987654321";

        before(function (done) {
            User.create({name: 'alex-wow', email: email, password: password})
                .then(function (user) {
                    done();
                });
        });

        after(function (done) {
            drop(User, done);
        });

        it("should authenticate user when Basic header is set", function (done) {
            var options = {
                method: "GET",
                url: "/api/v1/sessions",
                headers: {
                    authorization: 'Basic ' + (new Buffer(email + ':' + password, 'utf8')).toString('base64')
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(200);
                var payload = JSON.parse(response.payload);

                expect(payload.auth_token).to.have.length.of.at.least(32);
                expect(payload.email).to.equal(email);
                done();
            });
        });

        it("responds with status code 401 when Basic authentication header is not set", function (done) {
            var options = {method: "GET", url: "/api/v1/sessions"};
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(401);

                var error = JSON.parse(response.payload);
                expect(error.statusCode).to.equal(401);
                expect(error.error).to.equal('Unauthorized');
                expect(error.message).to.equal('Missing authentication');

                done();
            });
        });

        it("responds with status code 401 when Basic authentication header contains wrong email", function (done) {
            var options = {
                method: "GET",
                url: "/api/v1/sessions",
                headers: {
                    authorization: 'Basic ' + (new Buffer('non-existent@gmail.com:' + password, 'utf8')).toString('base64')
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(401);

                var error = JSON.parse(response.payload);
                expect(error.statusCode).to.equal(401);
                expect(error.error).to.equal('Unauthorized');
                expect(error.message).to.equal('Bad username or password');

                done();
            });
        });

        it("responds with status code 401 when Basic authentication header contains wrong password", function (done) {
            var options = {
                method: "GET",
                url: "/api/v1/sessions",
                headers: {
                    authorization: 'Basic ' + (new Buffer(email + ':wrong-password', 'utf8')).toString('base64')
                }
            };
            server.inject(options, function (response) {
                expect(response.statusCode).to.equal(401);

                var error = JSON.parse(response.payload);
                expect(error.statusCode).to.equal(401);
                expect(error.error).to.equal('Unauthorized');
                expect(error.message).to.equal('Bad username or password');

                done();
            });
        });
    });
});