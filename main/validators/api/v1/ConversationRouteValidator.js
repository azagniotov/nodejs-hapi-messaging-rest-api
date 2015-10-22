var Joi = require('joi');
var validatorUtils = require(global.__main_root + 'validators/api/v1/ValidatorUtils.js');

function ConversationRouteValidator() {
}

ConversationRouteValidator.prototype = {
    createNewConversation: function createNewConversation() {
        return {
            headers: validatorUtils.enforceHeaderContentTypeJson(),
            payload: {
                conversation: Joi.object().required().keys({
                    'started_by': validatorUtils.enforceNumericValue(),
                    'message': Joi.any(),
                    'recipient_ids': Joi.array().unique().min(1).items(Joi.number()).required()
                })
            },
            failAction: function (request, reply, source, error) {
                return validatorUtils.handleError(reply, error);
            }
        };
    }
};

var conversationRouteValidator = new ConversationRouteValidator();
module.exports = conversationRouteValidator;