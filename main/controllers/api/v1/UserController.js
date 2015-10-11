function UserController() {
};

UserController.prototype = {
    createNewUser: function createNewUser(request, reply) {
        reply(request.headers).code(201);
    },
    listUserById: function listUserById(request, reply) {

    },
    listAllUsers: function listAllUsers(request, reply) {

    }
};

var userController = new UserController();
module.exports = userController;