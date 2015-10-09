var server = require("../../server/server").listen(3000);
var data = require("./../fixtures/data");

describe("get Data", function () {
    it("responds with data object", function (done) {
        var options = {method: "GET", url: "/data/1"};
        server.inject(options, function (response) {
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual({ message : 'world' });
            done();
        });
    });

    it("responds with 404 - Not Found", function (done) {
        var options = {method: "GET", url: "/data/two"};
        server.inject(options, function (response) {
            expect(response.statusCode).toBe(404);
            expect(response.result).toBe("Not Found");
            done();
        });
    });
});