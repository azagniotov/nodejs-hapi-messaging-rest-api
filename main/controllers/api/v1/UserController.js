var userSerializer = require(__main_root + 'serializers/UserSerializer.js');
var controllerUtils = require(__main_root + 'controllers/api/v1/ControllerUtils.js');
var User = require(__main_root + 'db/DB.js').models.user;

function UserController() {
}

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
            reply({
                'code': 409,
                'message': '409 Conflict',
                'description': "User with email '" + payload.user.email + "' is already registered"
            }).code(409);
        });
    },
    listUserById: function listUserById(request, reply) {

        controllerUtils.apiKeyAuthorize(request, reply, function () {

            User.findById(request.params.user_id).then(function (user) {
                if (!user || user === null) {
                    reply({
                        'code': 404,
                        'message': '404 Not Found',
                        'description': "User with id '" + request.params.user_id + "' does not exist"
                    }).code(404);
                } else {
                    reply(userSerializer.serialize(user.get({plain: true}))).code(200);
                }
            });
        });
    },
    listAllUsers: function listAllUsers(request, reply) {

        controllerUtils.apiKeyAuthorize(request, reply, function () {

            User.findAll().then(function (users) {
                var plainUsers = [];
                users.forEach(function (user) {
                    plainUsers.push(user.get({plain: true}));
                });
                reply(userSerializer.serialize(plainUsers)).code(200);
            });

        });
    }
};

var userController = new UserController();
module.exports = userController;