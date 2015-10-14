var User = global.__models.User;
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
            reply(userSerializer.serialize(user.get({plain: true}))).code(201);
        }).catch(function (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                reply({
                    'code': 409,
                    'message': '409 Conflict',
                    'description': "User with email '" + payload.user.email + "' is already registered"
                }).code(409);
            } else {
                reply({
                    'code': 500,
                    'message': error.message,
                    'description': error.errors
                }).code(500);
            }
        });
    },
    listUserById: function listUserById(request, reply) {
        User.findById(request.params.user_id).then(function (user) {
            if (!user || user == null) {
                reply({
                    'code': 404,
                    'message': '404 Not Found',
                    'description': "User with id '" + request.params.user_id + "' does not exist"
                }).code(404);
            } else {
                reply(userSerializer.serialize(user.get({plain: true}))).code(200);
            }
        }).catch(function (error) {
            reply({
                'code': 500,
                'message': error.message,
                'description': error.errors
            }).code(500);
        });
    },
    listAllUsers: function listAllUsers(request, reply) {

    }
};

var userController = new UserController();
module.exports = userController;