var expect = require('../test_helper').expect;

describe('user model', function () {
    var User;

    before(function (done) {
        var sequelize = require(__main_root + 'db/Database.js').init("test_models");
        sequelize.sync({force: false}).then(function () {
            var hapiServer = require(__main_root + 'server/Server');
            var server = hapiServer.listen();
            server.start(function () {
                User = global.__models.User;
                done();
            });
        });
    });

    it('should save new user to DB when all required properties are set', function (done) {
        User.create({
            name: 'Alex',
            email: 'alex@gmail.com',
            password: '123456'
        }).then(function (user) {
            expect(user.name).to.equal('Alex');
            expect(user.email).to.equal('alex@gmail.com');
            expect(user.password).to.equal('123456');
            done();
        })
    });

    it('should not save new user to DB when not all required properties are set', function (done) {
        User.create({
            name: 'Alex',
            email: 'alex@gmail.com'
        }).catch(function (error) {
            expect(error.name).to.equal('SequelizeValidationError');
            expect(error.message).to.equal('notNull Violation: password cannot be null');
            done();
        })
    });
});
