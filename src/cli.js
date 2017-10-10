require('source-map-support').install();

process.on('unhandledRejection', function(err) {
    logger.fatal(err);
});

let init = {
    logger: require('./init/logger'),
    config: require('./init/config'),
    di: require('./init/di'),
};

let logger = init.logger();

let di = null;

init.config(logger)
    .then((config) => {
        return init.di(logger, config);
    })
    .then((_di) => {
        di = _di;

        return di.models.ensureIndexes();
    })
    .then((result) => {
        // eslint-disable-next-line no-console
        console.log('ensureIndexes', result);
        return di.db.mongo.close();
    })
    .then(() => {
        logger.info('done');
    })
    .catch((error) => {
        logger.fatal(error);
    });
