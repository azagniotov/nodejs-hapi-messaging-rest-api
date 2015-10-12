var JSONAPISerializer = require('jsonapi-serializer');

function UserSerializer() {
};

UserSerializer.prototype = {
    serialize: function serialize(model) {
        var toSerialize = {
            id: model.id,
            name: model.name,
            email: model.email
        };
        return new JSONAPISerializer('users', toSerialize, {
            dataLinks: {
                self: function (user) {
                    return '/api/v1/users/' + user.id
                },
                all: '/api/v1/users'
            },
            attributes: ['name', 'email']
        });
    }
};

var userSerializer = new UserSerializer();
module.exports = userSerializer;