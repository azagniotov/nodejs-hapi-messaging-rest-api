var validatorUtils = require(__main_root + 'validators/api/v1/ValidatorUtils.js');

function MessageRouteValidator() {
}

MessageRouteValidator.prototype = {
    validateListMessageById: function validateListMessageById() {
        return {
            headers: validatorUtils.enforceHeaderContentType('application/json'),
            params: {message_id: validatorUtils.enforceNumericValue()},
            failAction: function (request, reply, source, error) {
                return validatorUtils.handleError(reply, error);
            }
        };
    }
};

var messageRouteValidator = new MessageRouteValidator();
module.exports = messageRouteValidator;