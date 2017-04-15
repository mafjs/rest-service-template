var ServiceLocator = require('maf-service-locator');

var setDebug = function (api, di) {

    if (di.debug && typeof api.setDebug === 'function') {
        api.setDebug(api);
    }

    return api;
};

module.exports = function (di) {

    return new Promise((resolve) => {

        var logger = di.logger.getLogger('api');

        var api = new ServiceLocator(logger);

        // init apis here

        di.api = api;

        resolve(di);
    });

};
