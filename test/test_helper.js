global.__project_root = __dirname + '/../';
global.__main_root = __project_root + 'main/';

var server = require(__main_root + 'server/Server.js').listen();
module.exports = {server: server};