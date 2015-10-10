function RootController() {
};

RootController.prototype = {
    apiDiscovery: function apiDiscovery(request, reply) {

        var idx,
            route,
            apiVersion,
            chunks,
            resource,
            endpoint,
            routingTable = module.parent.parent.exports.routingTable,
            discoveredApi = {};
        for (idx = 0; idx < routingTable.length; idx++) {
            route = routingTable[idx];
            if (route.settings.id !== 'root') {
                chunks = route.path.split('/');
                apiVersion = chunks[2].replace('v', '');
                resource = chunks[3];

                if (discoveredApi[resource] == null || (typeof(discoveredApi[resource]) === 'undefined')) {
                    discoveredApi[resource] = [];
                }

                endpoint = {
                    version: apiVersion,
                    name: route.settings.id,
                    method: route.method.toUpperCase(),
                    path: route.path
                };
                if (route.params && route.params.length > 0) {
                    endpoint.params = route.params;
                }
                discoveredApi[resource].push(endpoint);
            }
        }
        reply(JSON.stringify(discoveredApi, null, 2)).header('Content-Type', 'application/json');
    }
};

var rootController = new RootController();
module.exports = rootController;