function ConversationController() {
}

ConversationController.prototype = {
    createNewConversation: function createNewConversation(request, reply) {
        reply({'message': 'Created'}).code(201);
    }
};

var conversationController = new ConversationController();
module.exports = conversationController;