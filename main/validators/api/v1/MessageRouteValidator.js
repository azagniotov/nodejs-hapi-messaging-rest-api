var Joi = require('joi');

function MessageRouteValidator() {
}

MessageRouteValidator.prototype = {
    validateListMessageById: function validateListMessageById() {
        return {
            headers: Joi.object({
                'content-type': Joi.string().required().valid('application/json')
            }).unknown(),

            params: {
                message_id: Joi.string().regex(/^[0-9]{1,}$/)
            },
            failAction: function (request, reply, source, error) {
                return handleError(reply, error);
            }
        };
    }
};

function handleError(reply, error) {
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

var messageRouteValidator = new MessageRouteValidator();
module.exports = messageRouteValidator;