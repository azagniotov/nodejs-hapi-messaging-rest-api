var sessionsController = require(global.__main_root + 'controllers/api/v1/SessionsController.js');

var authenticateUserWithBasic = {
    path: '/api/v1/sessions',
    method: 'GET',
    config: {
        id: 'get_authorization_token_using_basic_auth',
        description: 'Authenticate user with Basic Authentication',
        handler: sessionsController.authenticateUserWithBasic,
        auth: 'simple'
    }
};

module.exports = authenticateUserWithBasic;