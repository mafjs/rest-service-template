// High-Level APIs

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
        let logger = di.logger.getLogger('hapi');

        let hapi = new ServiceLocator(logger);

        // init high-level apis here

        di.hapi = hapi;

        resolve(di);
    });
};
