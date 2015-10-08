var http = require('http');

exports.start = function() {
    var server = http.createServer(function(req, res) {
        res.writeHead(200);
        res.end('nodejs-hapi-messaging-rest-api');
    });
    server.listen(3000);
    console.log('Server is listening on port: ' + 3000);
};
