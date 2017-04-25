require('source-map-support').install();
require('maf-error/initGlobal');

var ServerError = require('maf-error').create('ServerError', {
    SERVER_ERROR: '%message%'
});

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

        // eslint-disable-next-line
        app.use(function (error, req, res, next) {

            var addAllRequestDataToError = function (req, error) {
                error.message += '\n req path = ' + req.path;
                error.message += ',\n request path params = ' + JSON.stringify(req.params);
                error.message += ',\n request query params = ' + JSON.stringify(req.query);
                error.message += ',\n request cookies = ' + JSON.stringify(req.cookies);
                error.message += ',\n request headers = ' + JSON.stringify(req.params);
                error.message += ',\n request body = ' + JSON.stringify(req.body);

                return ServerError.createError(ServerError.CODES.SERVER_ERROR, error).bind({message: error.message});
            };

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
                        logger.error(addAllRequestDataToError(req, error));

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
