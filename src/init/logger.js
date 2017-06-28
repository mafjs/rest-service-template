var log4js = require('log4js-nested');

module.exports = function () {
    if (process.env.NODE_ENV === 'production') {
        log4js.setGlobalLogLevel('INFO');
    } else {
        log4js.setGlobalLogLevel('TRACE');
    }

    return log4js.getLogger('maf-rest-service');
};
