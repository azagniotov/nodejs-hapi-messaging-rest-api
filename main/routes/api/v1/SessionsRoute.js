var sessionsController = require(__main_root + 'controllers/api/v1/SessionsController.js');

var authenticateUserWithBasic = {
    path: '/api/v1/sessions',
    method: 'GET',
    config: {
        id: 'authenticate_user_with_basic',
        description: 'Authenticate user with Basic Authentication',
        handler: sessionsController.authenticateUserWithBasic,
        auth: 'simple'
    }
};

module.exports = authenticateUserWithBasic;