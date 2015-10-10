var dataController = require("../../../controllers/api/v1/DataController");
var dataRouteValidator = require("../../../validators/api/v1/DataRouteValidator");

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

module.exports = getData;