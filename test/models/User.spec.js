var expect = require('../test_helper').expect;

/* istanbul ignore next */
describe('user model', function () {
    var User;

    before(function (done) {
        var sequelize = require(__main_root + 'db/Database.js').init("test_user_model", false);
        sequelize.sync({force: true}).then(function () {
            var hapiServer = require(__main_root + 'server/Server');
            var server = hapiServer.listen();
            server.start(function () {
                User = global.__models.User;
                done();
            });
        });
    });

    afterEach(function (done) {
        User.destroy({
            truncate: true
        }).then(function (affectedRows) {
            done();
        })
    });

    it('should save new user to DB when all required properties are set', function (done) {
        User.create({
            name: 'Alex',
            email: 'alex@gmail.com',
            password: '123456'
        }).then(function (user) {
            expect(user.name).to.equal('Alex');
            expect(user.email).to.equal('alex@gmail.com');
            expect(user.salt).to.not.be.null;
            expect(user.password).to.contain(user.salt);
            done();
        })
    });

    it('should not save new user to DB when user by email already exists', function (done) {
        User.bulkCreate([
            {name: 'Alex1', email: 'alex@gmail.com', password: '123456'},
            {name: 'Alex2', email: 'alex@gmail.com', password: '654321'}
        ]).catch(function (error) {
            expect(error.name).to.equal('SequelizeUniqueConstraintError');
            expect(error.message).to.equal('Validation error');
            expect(error.errors[0].message).to.equal('email must be unique');
            done();
        });
    });

    it('should authenticate user', function (done) {
        var rawPassword = '123456';
        User.create({
            name: 'Alex',
            email: 'alex@gmail.com',
            password: rawPassword
        }).then(function (savedUser) {
            User.findOne({where: {email: savedUser.email}}).then(function (foundUser) {
                var bcrypt = require('bcrypt-nodejs');
                var authenticated = bcrypt.compareSync(rawPassword, foundUser.password);

                expect(authenticated).to.be.true;

                done();
            });
        })
    });

    it('should generate auth_token before creating new user', function (done) {
        User.create({
            name: 'Alex',
            email: 'alex@gmail.com',
            password: '123456'
        }).then(function (user) {
            expect(user.authToken).to.have.length.of.at.least(32);
            done();
        })
    });

    it('should not save new user to DB when password is not set', function (done) {
        User.create({
            name: 'Alex',
            email: 'alex@gmail.com'
        }).catch(function (error) {
            expect(error.name).to.equal('SequelizeValidationError');
            expect(error.message).to.equal('notNull Violation: password cannot be null');
            done();
        })
    });

    it('should not save new user to DB when name is not set', function (done) {
        User.create({
            password: '123456',
            email: 'alex@gmail.com'
        }).catch(function (error) {
            expect(error.name).to.equal('SequelizeValidationError');
            expect(error.message).to.equal('notNull Violation: name cannot be null');
            done();
        })
    });

    it('should not save new user to DB when email is not set', function (done) {
        User.create({
            name: 'Alex',
            password: '123456'
        }).catch(function (error) {
            expect(error.name).to.equal('SequelizeValidationError');
            expect(error.message).to.equal('notNull Violation: email cannot be null');
            done();
        })
    });
});
