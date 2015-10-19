var expect = require('../test_helper').expect;
var drop = require('../test_helper').drop;

/* istanbul ignore next */
describe('message model', function () {
    var Message = require(__main_root + 'db/DB.js').models.message;

    before(function (done) {
        drop(Message, done);
    });

    afterEach(function (done) {
        drop(Message, done);
    });

    it('should save new message to DB when all required properties are set', function (done) {
        Message.create({
            senderId: 1,
            text: 'This is a message that says hello'
        }).then(function (message) {
            expect(message.senderId).to.equal(1);
            expect(message.text).to.equal('This is a message that says hello');
            done();
        })
    });

    it('should not save new message to DB when senderId is not set', function (done) {
        Message.create({text: 'This is a message that says hello'}).catch(function (error) {
            expect(error.name).to.equal('SequelizeValidationError');
            expect(error.message).to.equal('notNull Violation: senderId cannot be null');
            done();
        })
    });

    it('should get message text from DB', function (done) {
        Message.create({
            senderId: 1,
            text: 'This is a message that says hello'
        }).then(function (savedMessage) {
            Message.findOne({where: {sender_id: savedMessage.senderId}}).then(function (foundMessage) {
                expect(savedMessage.text).to.equal(foundMessage.text);
                done();
            });
        })
    });
});
