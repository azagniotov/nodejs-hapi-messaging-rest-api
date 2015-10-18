var messageController = require(__main_root + 'controllers/api/v1/MessageController.js');
var messageRouteValidator = require(__main_root + 'validators/api/v1/MessageRouteValidator.js');

var listMessageById = {
    path: '/api/v1/messages/{message_id}',
    method: 'GET',
    config: {
        id: 'list_message_by_id',
        description: 'List message by id',
        handler: messageController.listMessageById,
        validate: messageRouteValidator.validateListMessageById()
    }
};

module.exports = [listMessageById];