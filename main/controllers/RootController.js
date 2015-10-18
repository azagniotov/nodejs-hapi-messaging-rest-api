function RootController() {
}

/* istanbul ignore next */
RootController.prototype = {
    apiDiscovery: function apiDiscovery(request, reply) {

        var server = require(__main_root + 'server/Server').listen(),
            idx,
            route,
            apiVersion,
            chunks,
            resource,
            endpoint,
            discoveredApi = {};

        for (idx = 0; idx < server.table()[0].table.length; idx++) {
            route = server.table()[0].table[idx];
            if (route.path !== '/') {
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