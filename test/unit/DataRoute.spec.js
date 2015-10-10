var server = require("../../src/server/Server.js").listen(3000);

describe("Data Endpoint", function() {
    var route = server.lookup('get_data_by_id');

    it("should not be null", function() {
        expect(route).not.toBe(null);
    });

    it("should have expected path", function() {
        expect(route.path).toBe('/api/v1/data/{id}');
    });

    it("should have expected method", function() {
        expect(route.method).toBe('get');
    });

    it("should have expected description", function() {
        expect(route.settings.description).toBe('Returns canned data response by id');
    });
});
