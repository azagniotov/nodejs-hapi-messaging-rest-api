var User = require(__main_root + 'models/User.js');
var userSerializer = require(__main_root + 'serializers/UserSerializer.js');

function UserController() {
};

UserController.prototype = {
    createNewUser: function createNewUser(request, reply) {
        var payload = request.payload;
        User.create({
            name: payload.user.name,
            email: payload.user.email,
            password: payload.user.password
        }).then(function (user) {
            reply(userSerializer.serialize(user)).code(201);
        }).catch(function (error) {
            reply({
                'code': 409,
                'message': '409 Conflict',
                'description': "User with email '" + payload.user.email + "' is already registered"
            }).code(409);
        });
    },
    listUserById: function listUserById(request, reply) {

    },
    listAllUsers: function listAllUsers(request, reply) {

    }
};

var userController = new UserController();
module.exports = userController;