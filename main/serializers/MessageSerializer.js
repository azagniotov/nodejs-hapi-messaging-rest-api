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
            keyForAttribute: 'underscore_case',
            attributes: ['senderId', 'text', 'created_at']
        });
    }
};

var messageSerializer = new MessageSerializer();
module.exports = messageSerializer;