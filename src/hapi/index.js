// High-Level APIs

var ServiceLocator = require('maf-service-locator');

var setDebug = function (api, di) {

    if (di.debug && typeof api.setDebug === 'function') {
        api.setDebug(api);
    }

    return api;
};

module.exports = function (di) {

    return new Promise((resolve) => {

        var logger = di.logger.getLogger('hapi');

        var hapi = new ServiceLocator(logger);

        // init high-level apis here

        di.hapi = hapi;

        resolve(di);
    });

};
