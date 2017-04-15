module.exports = function (logger) {
    process.on('uncaughtException', (error) => {
        logger.fatal(error);
    });

    process.on('unhandledRejection', (reason, p) => {
        logger.fatal(reason, p);
    });

};
