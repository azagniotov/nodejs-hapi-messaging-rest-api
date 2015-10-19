var Joi = require('joi');
var validatorUtils = require(__main_root + 'validators/api/v1/ValidatorUtils.js');

function UserRouteValidator() {
}

UserRouteValidator.prototype = {
    validateCreateNewUser: function validateCreateNewUser() {
        return {
            headers: validatorUtils.enforceHeaderContentType('application/json'),
            payload: {
                user: Joi.object().required().keys({
                    'name': Joi.string().required(),
                    'email': Joi.string().required(),
                    'password': Joi.string().required()
                })
            },
            failAction: function (request, reply, source, error) {
                return validatorUtils.handleError(reply, error);
            }
        };
    },
    validateListUserById: function validateListUserById() {
        return {
            headers: validatorUtils.enforceHeaderContentType('application/json'),
            params: {user_id: validatorUtils.enforceNumericValue()},
            failAction: function (request, reply, source, error) {
                return validatorUtils.handleError(reply, error);
            }
        };
    },
    validateListAllUsers: function validateListAllUsers() {
        return {headers: validatorUtils.enforceHeaderContentType('application/json')};
    }
};

var userRouteValidator = new UserRouteValidator();
module.exports = userRouteValidator;