var Config = require('maf-config');

module.exports = function () {

    return new Promise((resolve/*, reject*/) => {
        var config = new Config();

        config.setRaw('.', {
            host: null,
            port: process.env.PORT || 3000,
            publicBaseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000',
            db: {
                mongo: {
                    dsl: process.env.MONGO_DSL || 'mongodb://mongo:27017/db',
                    options: {
                        reconnectTries: 60,
                        reconnectInterval: 1000
                    }
                }
            },
            api: {

            }
        });

        resolve(config);
    });

};
