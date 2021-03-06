let ServiceLocator = require('maf-service-locator');

// let setDebug = function(api, di) {
//     if (di.debug && typeof api.setDebug === 'function') {
//         api.setDebug(api);
//     }
//
//     return api;
// };

module.exports = function(di) {
    return new Promise((resolve) => {
        let logger = di.logger.getLogger('api');

        let api = new ServiceLocator(logger);

        // init apis here

        di.api = api;

        resolve(di);
    });
};
