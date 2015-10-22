var messageSerializer = require(global.__main_root + 'serializers/MessageSerializer.js');
var controllerUtils = require(global.__main_root + 'controllers/api/v1/ControllerUtils.js');
var Message = require(global.__main_root + 'db/DB.js').models.message;

function MessageController() {
}

MessageController.prototype = {

    listMessageById: function listMessageById(request, reply) {

        controllerUtils.apiKeyAuthorize(request, reply, function () {

            Message.findById(request.params.message_id).then(function (message) {
                if (!message || message === null) {
                    reply({
                        'code': 404,
                        'message': '404 Not Found',
                        'description': "Message with id '" + request.params.message_id + "' does not exist"
                    }).code(404);
                } else {
                    reply(messageSerializer.serialize(message.get({plain: true}))).code(200);
                }
            });
        });
    }
};

var messageController = new MessageController();
module.exports = messageController;