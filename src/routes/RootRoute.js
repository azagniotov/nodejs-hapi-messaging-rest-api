var rootController = require("../controllers/RootController.js");

var rootRoute = {
    path: '/',
    method: 'GET',
    config: {
        id: 'root',
        description: 'Gets all of the endpoint categories that the API supports',
        handler: rootController.apiDiscovery
    }
};

module.exports = rootRoute;