var Joi = require('joi');

var DataRouteValidator = function DataRouteValidator() {
};

DataRouteValidator.prototype = {
    validateParamId: function validateParamId() {
        return {
            params: {
                id: Joi.string().regex(/^[0-9]{1,1}$/)
            }
        }
    }
};

var dataRouteValidator = new DataRouteValidator();
module.exports = dataRouteValidator;