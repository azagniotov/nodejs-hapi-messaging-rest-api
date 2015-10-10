var server = require("../../server/server").listen(3000);

describe("Root Endpoint", function() {
    var route = server.lookup('root');

    it("should not be null", function() {
        expect(route).not.toBe(null);
    });

    it("should have expected path", function() {
        expect(route.path).toBe('/');
    });

    it("should have expected method", function() {
        expect(route.method).toBe('get');
    });

    it("should have expected description", function() {
        expect(route.settings.description).toBe('Returns hello world');
    });
});
