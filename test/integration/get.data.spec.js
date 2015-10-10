var server = require("../../server/server").listen(3000);

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
        var options = {method: "GET", url: "/data/2"};
        server.inject(options, function (response) {
            expect(response.statusCode).toBe(404);
            expect(response.result).toBe("Not Found");
            done();
        });
    });

    it("responds with Bad Request when param is invalid", function (done) {
        var options = {method: "GET", url: "/data/two"};
        server.inject(options, function (response) {
            expect(response.statusCode).toBe(400);

            var error = JSON.parse(response.payload);
            expect(error.statusCode).toBe(400);
            expect(error.error).toBe("Bad Request");
            done();
        });
    });
});