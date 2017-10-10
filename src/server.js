require('source-map-support').install();

require('maf-error/initGlobal');

let init = {
    logger: require('./init/logger'),
    globalErrorHandlers: require('./init/globalErrorHandlers'),
    config: require('./init/config'),
    di: require('./init/di'),
    server: require('./init/server'),
    processSignals: require('./init/processSignals'),
    rest: require('./rest'),
};

let logger = init.logger();

init.globalErrorHandlers(logger);

let di;

init.config(logger)
    .then((config) => {
        return init.di(logger, config);
    })
    .then((_di) => {
        di = _di;
        return init.server(di);
    })
    .then((app) => {
        return init.rest(di, app);
    })
    .then((app) => {
        let host = di.config.get('host');
        let port = di.config.get('port');

        let server = app.listen(port, host, function() {
            di.logger.info(`listen on ${host}:${port}`);
        });

        return init.processSignals(di, server);
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });
