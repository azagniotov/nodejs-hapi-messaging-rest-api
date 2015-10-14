function SessionsController() {
}

SessionsController.prototype = {
    authenticateUserWithBasic: function authenticateUserWithBasic(request, reply) {
        var session = {
            email: request.auth.credentials.email,
            auth_token: request.auth.credentials.auth_token
        };
        reply(session).code(200);
    }
};

var sessionsController = new SessionsController();
module.exports = sessionsController;