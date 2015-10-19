var Joi = require('joi');

function ValidatorUtils() {
}

ValidatorUtils.prototype = {
    handleError: function handleError(reply, error) {
        if (error.isBoom && error.output.statusCode === 400 && error.data.name === 'ValidationError') {
            error.output.statusCode = 422;
            error.output.payload = {
                "code": 422,
                "message": "422 Unprocessable Entity",
                "description": "The server was unable to process the Request payload: " + error.data.details[0].message
            };
            return reply(error);
        }
    },
    enforceHeaderContentType: function enforceHeaderContentType(contentType) {
        return Joi.object({
            'content-type': Joi.string().required().valid(contentType)
        }).unknown();
    },
    enforceNumericValue: function enforceHeaderContentType(contentType) {
        return Joi.string().regex(/^[0-9]{1,}$/);
    }
};

var validatorUtils = new ValidatorUtils();
module.exports = validatorUtils;

