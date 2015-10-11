var userSerializer = require(__main_root + 'serializers/UserSerializer.js');

function UserController() {
};

UserController.prototype = {
    createNewUser: function createNewUser(request, reply) {

        var dataOne = {
            id: 1,
            name: 'Alex',
            email: 'alex@gmail.com',
            password: '',
            salt: 'lkfu84yt3i4uybi',
            auth_token: 'rmpmcw9or487tvyn8mlrsybr3ir7t3br837bt',
            created_at: '',
            updated_at: ''
        };

        var dataTwo = [{
            id: 1,
            name: 'Alex',
            email: 'alex@gmail.com',
            password: '',
            salt: 'lkfu84yt3i4uybi',
            auth_token: 'rmpmcw9or487tvyn8mlrsybr3ir7t3br837bt',
            created_at: '',
            updated_at: ''
        }, {
            id: 2,
            name: 'Tracy',
            email: 'tracy@gmail.com',
            password: '',
            salt: 'kfhcli4vo9',
            auth_token: 'lmxr8bcytv34omm3o4tyo348yct',
            created_at: '',
            updated_at: ''
        }];

        reply(userSerializer.serialize(dataOne)).code(201);
    },
    listUserById: function listUserById(request, reply) {

    },
    listAllUsers: function listAllUsers(request, reply) {

    }
};

var userController = new UserController();
module.exports = userController;