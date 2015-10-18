var expect = require('../test_helper').expect;

/* istanbul ignore next */
describe('user model', function () {
    var User = require(__main_root + 'db/DB.js').models.user;

    before(function (done) {
        User.sync({force: true}).then(function () {
            done();
        });
    });

    afterEach(function (done) {
        User.sync({force: true}).then(function () {
            done();
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
            expect(user.salt).to.not.equal(null);
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

    describe('authentication', function () {
        var email = 'alex@gmail.com';
        var password = '123456';
        var savedUserAuthToken;
        before(function (done) {
            User.create({
                name: 'Alex',
                email: 'alex@gmail.com',
                password: password
            }).then(function (savedUser) {
                savedUserAuthToken = savedUser.authToken;
                done();
            })
        });

        after(function (done) {
            User.sync({force: true}).then(function () {
                done();
            });
        });

        it('should authenticate user when valid credentials are provided', function (done) {
            User.authenticate(email, password, function (isAuthenticated, authToken) {
                expect(isAuthenticated).to.equal(true);
                expect(authToken).to.equal(savedUserAuthToken);
                done();
            });
        });

        it('should not authenticate user when invalid email is provided', function (done) {
            User.authenticate('invalid@email.com', password, function (isAuthenticated, authToken) {
                expect(isAuthenticated).to.equal(false);
                expect(authToken).to.equal(null);
                done();
            });
        });

        it('should not authenticate user when invalid password is provided', function (done) {
            User.authenticate(email, '11111111111', function (isAuthenticated, authToken) {
                expect(isAuthenticated).to.equal(false);
                expect(authToken).to.equal(null);
                done();
            });
        });
    });
});
