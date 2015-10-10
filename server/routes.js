var Joi = require('joi');
var data = require("../db/fixtures/data");

var healthCheck = {
    path: '/',
    method: 'GET',
    handler: function (request, reply) {
        reply('hello world');
    },
    config: {
        description: 'Returns hello world',
        notes: 'Just a sanity check method',
    }
};

var getData = {
    path: '/data/{index}',
    method: 'GET',
    handler: function (request, reply) {
        var index = parseInt(request.params.index);
        var isValidKey = typeof data[index] !== 'undefined';
        if (isValidKey) {
            reply(data[index]);
        } else {
            reply('Not Found').code(404);
        }
    },
    config: {
        description: 'Returns canned data response',
        notes: 'Just a sanity check method',
        validate: {
            params: {
                index: Joi.string().regex(/^[0-9]{1,1}$/)
            }
        }
    }
};

module.exports = [healthCheck, getData];