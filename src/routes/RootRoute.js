var rootRoute = {
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

module.exports = rootRoute;