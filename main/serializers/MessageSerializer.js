var JSONAPISerializer = require('jsonapi-serializer');

function MessageSerializer() {
}

MessageSerializer.prototype = {
    serialize: function serialize(model) {
        return new JSONAPISerializer('messages', model, {
            dataLinks: {
                self: function (message) {
                    return '/api/v1/messages/' + message.id
                }
            },
            attributes: ['sender_id', 'text', 'created_at']
        });
    }
};

var messageSerializer = new MessageSerializer();
module.exports = messageSerializer;