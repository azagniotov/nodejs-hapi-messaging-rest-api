var rootController = require("../controllers/RootController.js");

var rootRoute = {
    path: '/',
    method: 'GET',
    config: {
        id: 'root',
        description: 'Returns hello world',
        notes: 'Just a sanity check method',
        handler: rootController.apiDiscovery
    }
};

module.exports = rootRoute;