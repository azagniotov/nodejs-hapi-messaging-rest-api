var JSONAPISerializer = require('jsonapi-serializer');

function UserSerializer() {
};

UserSerializer.prototype = {
    serialize: function serialize(data) {
        return new JSONAPISerializer('users', data, {
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