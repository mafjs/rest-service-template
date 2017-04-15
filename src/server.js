require('maf-error/initGlobal');

var init = {
    logger: require('./init/logger'),
    globalErrorHandlers: require('./init/globalErrorHandlers'),
    config: require('./init/config'),
    di: require('./init/di'),
    server: require('./init/server'),
    processSignals: require('./init/processSignals'),
    rest: require('./rest')
};

var logger = init.logger();

init.globalErrorHandlers(logger);

var di;

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

        // TODO
        app.use(function (error, req, res, next) {

            if (error && error.getCheckChain) {
                error.getCheckChain()
                    .ifCode(
                        'INVALID_REQUEST_DATA',
                        function (error) {
                            res.status(400).json({
                                error: {
                                    message: error.mesage,
                                    code: error.code,
                                    list: error.list || error.details
                                }
                            });
                        }
                    )
                    .else(function (error) {
                        logger.error(error);

                        res.status(500).json({
                            error: {
                                message: 'Server Error',
                                code: 'SERVER_ERROR'
                            }
                        });
                    })
                    .check();

            } else {
                logger.error(error);

                res.status(500).json({
                    error: {
                        message: 'Server Error',
                        code: 'SERVER_ERROR'
                    }
                });
            }
        });

        var host = di.config.get('host');
        var port = di.config.get('port');

        var server = app.listen(port, host, function () {
            di.logger.info(`listen on ${host}:${port}`);
        });

        return init.processSignals(di, server);
    })
    .catch((error) => {
        logger.error(error);
        process.exit(1);
    });
