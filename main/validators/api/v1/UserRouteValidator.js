var Joi = require('joi');

function UserRouteValidator() {
};

UserRouteValidator.prototype = {
    validateCreateNewUser: function validateCreateNewUser() {
        return {
            headers: Joi.object({
                'content-type': Joi.string().required().valid('application/json')
            }).unknown(),

            payload: {
                user: Joi.object().required().keys({
                    'name': Joi.string().required(),
                    'email': Joi.string().required(),
                    'password': Joi.string().required()
                })
            }
        }
    },
    validateListUserById: function validateListUserById() {
        return {
            params: {
                id: Joi.string().regex(/^[0-9]{1,1}$/)
            }
        }
    },
    validateListAllUsers: function validateListAllUsers() {
        return {
            params: {
                id: Joi.string().regex(/^[0-9]{1,1}$/)
            }
        }
    }
};

var userRouteValidator = new UserRouteValidator();
module.exports = userRouteValidator;