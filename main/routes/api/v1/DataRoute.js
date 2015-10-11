var dataController = require(__main_root + 'controllers/api/v1/DataController.js');
var dataRouteValidator = require(__main_root + 'validators/api/v1/DataRouteValidator.js');

var getData = {
    path: '/api/v1/data/{id}',
    method: 'GET',
    config: {
        id: 'get_data_by_id',
        description: 'Returns canned data response by id',
        notes: 'Just a sanity check method',
        handler: dataController.findByID,
        validate: dataRouteValidator.validateParamId()
    }
};

module.exports = [getData];