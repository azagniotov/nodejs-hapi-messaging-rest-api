var userController = require(global.__main_root + 'controllers/api/v1/UserController.js');
var userRouteValidator = require(global.__main_root + 'validators/api/v1/UserRouteValidator.js');

var createNewUser = {
    path: '/api/v1/users',
    method: 'POST',
    config: {
        id: 'create_new_user',
        description: 'Creates new user',
        handler: userController.createNewUser,
        validate: userRouteValidator.validateCreateNewUser()
    }
};

var listUserById = {
    path: '/api/v1/users/{user_id}',
    method: 'GET',
    config: {
        id: 'list_user_by_id',
        description: 'List user by id',
        handler: userController.listUserById,
        validate: userRouteValidator.validateListUserById()
    }
};

var listAllUsers = {
    path: '/api/v1/users',
    method: 'GET',
    config: {
        id: 'list_all_users',
        description: 'List all users',
        handler: userController.listAllUsers,
        validate: userRouteValidator.validateListAllUsers()
    }
};

module.exports = [createNewUser, listUserById, listAllUsers];