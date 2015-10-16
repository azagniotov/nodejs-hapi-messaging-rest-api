module.exports = {
    "development": {
        "host": "localhost",
        "database": "development_database",
        "username": null,
        "password": null,
        "dialect": "sqlite",
        "pool": {
            "max": 5,
            "min": 0,
            "idle": 10000
        },
        "logging": console.log,
        "storage": global.__main_root + "db/development.sqlite3"
    },
    "test": {
        "host": "localhost",
        "database": "test_database",
        "username": null,
        "password": null,
        "dialect": "sqlite",
        "pool": {
            "max": 5,
            "min": 0,
            "idle": 10000
        },
        "logging": false,
        "storage": global.__main_root + "db/test.sqlite3"
    },
    "production": {
        "host": "localhost",
        "database": "production_database",
        "username": null,
        "password": null,
        "dialect": "sqlite",
        "pool": {
            "max": 5,
            "min": 0,
            "idle": 10000
        },
        "logging": console.log,
        "storage": global.__main_root + "db/production.sqlite3"
    }
};