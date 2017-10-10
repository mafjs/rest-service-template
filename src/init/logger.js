let Logger = require('maf-logger');

module.exports = function() {
    let logger = Logger.create('maf-rest-service');

    if (process.env.NODE_ENV === 'production') {
        logger.level('INFO');
    } else {
        logger.level('TRACE');
    }

    return logger;
};
