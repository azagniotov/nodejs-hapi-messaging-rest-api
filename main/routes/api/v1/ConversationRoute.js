var conversationController = require(global.__main_root + 'controllers/api/v1/ConversationController.js');
var conversationRouteValidator = require(global.__main_root + 'validators/api/v1/ConversationRouteValidator.js');

var createNewConversation = {
    path: '/api/v1/conversations',
    method: 'POST',
    config: {
        id: 'create_new_conversation',
        description: 'Create new conversation',
        handler: conversationController.createNewConversation,
        validate: conversationRouteValidator.createNewConversation()
    }
};

module.exports = [createNewConversation];