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
            },
            failAction: function (request, reply, source, error) {

                if (error.isBoom && error.output.statusCode === 400 && error.data.name === 'ValidationError') {
                    error.output.statusCode = 422;
                    error.output.payload = {
                        "code": 422,
                        "message": "422 Unprocessable Entity",
                        "description": "The server was unable to process the Request payload: " + error.data.details[0].message
                    };
                    return reply(error);
                }
            }
        }
    },
    validateListUserById: function validateListUserById() {
        return {
            params: {
                user_id: Joi.string().regex(/^[0-9]{1,}$/)
            },
            failAction: function (request, reply, source, error) {

                if (error.isBoom && error.output.statusCode === 400 && error.data.name === 'ValidationError') {
                    error.output.statusCode = 422;
                    error.output.payload = {
                        "code": 422,
                        "message": "422 Unprocessable Entity",
                        "description": "The server was unable to process the Request payload: " + error.data.details[0].message
                    };
                    return reply(error);
                }
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