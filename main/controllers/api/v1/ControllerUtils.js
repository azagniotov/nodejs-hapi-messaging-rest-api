var User = require(__main_root + 'db/DB.js').models.user;

function ControllerUtils() {
}

ControllerUtils.prototype = {
    apiKeyAuthorize: function apiKeyAuthorize(request, reply, controllerHandler) {
        if (!request.headers['x-api-key']) {
            reply({
                'code': 401,
                'message': '401 Unauthorized',
                'description': "X-Api-Key header is not set"
            }).code(401);
        } else {
            User.findOne({where: {auth_token: request.headers['x-api-key']}}).then(function (foundUser) {
                if (foundUser && foundUser.isNewRecord === false) {
                    controllerHandler();
                } else {
                    reply({
                        'code': 401,
                        'message': '401 Unauthorized',
                        'description': "Api key is not valid"
                    }).code(401);
                }
            });
        }
    }
};

var controllerUtils = new ControllerUtils();
module.exports = controllerUtils;

