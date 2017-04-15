process.on('unhandledRejection', function (err) {
    logger.fatal(err);
});

var init = {
    logger: require('./init/logger'),
    config: require('./init/config'),
    di: require('./init/di')
};

var logger = init.logger();

var di = null;

init.config(logger)
    .then((config) => {
        return init.di(logger, config);
    })
    .then((_di) => {
        di = _di;

        return di.models.ensureIndexes();
    })
    .then((result) => {
        console.log('ensureIndexes', result);
        return di.db.mongo.close();
    })
    .then(() => {
        logger.info('done');
    })
    .catch((error) => {
        logger.fatal(error);
    });
