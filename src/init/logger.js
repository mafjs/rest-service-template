var Logger = require('maf-logger');

module.exports = function () {
    var logger = Logger.create('maf-rest-service');

    if (process.env.NODE_ENV === 'production') {
        logger.level('INFO');
    } else {
        logger.level('TRACE');
    }

    return logger;
};
