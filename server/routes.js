var Joi = require('joi');
var data = require("../db/fixtures/data");

var healthCheck = {
    path: '/',
    method: 'GET',
    config: {
        id: 'root',
        description: 'Returns hello world',
        notes: 'Just a sanity check method',
        handler: function (request, reply) {
            reply('hello world');
        }
    }
};

var getData = {
    path: '/data/{index}',
    method: 'GET',
    config: {
        id: 'get_data_by_id',
        description: 'Returns canned data response by id',
        notes: 'Just a sanity check method',
        handler: function (request, reply) {
            var index = parseInt(request.params.index);
            var isValidKey = typeof data[index] !== 'undefined';
            if (isValidKey) {
                reply(data[index]);
            } else {
                reply('Not Found').code(404);
            }
        },
        validate: {
            params: {
                index: Joi.string().regex(/^[0-9]{1,1}$/)
            }
        }
    }
};

module.exports = [healthCheck, getData];