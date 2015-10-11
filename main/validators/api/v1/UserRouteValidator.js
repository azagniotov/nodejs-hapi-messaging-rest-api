var Joi = require('joi');

function UserRouteValidator() {
};

UserRouteValidator.prototype = {
    validateCreateNewUser: function validateCreateNewUser() {
        return {
            params: {
                id: Joi.string().regex(/^[0-9]{1,1}$/)
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