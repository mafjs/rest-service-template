require('source-map-support').install();

const repl = require('repl-extra');

process.on('unhandledRejection', function(err) {
    logger.fatal(err);
});

let init = {
    logger: require('./init/logger'),
    config: require('./init/config'),
    di: require('./init/di'),
};

let logger = init.logger();

init.config(logger)
    .then((config) => {
        return init.di(logger, config);
    })
    .then((di) => {
        let server = repl.startExtra({prompt: '# '});

        server.context.i = function(data, depth) {
            if (typeof depth === 'undefined') {
                depth = 1;
            }

            // eslint-disable-next-line no-console
            console.log(require('util').inspect(data, {
                showHidden: false,
                colors: false,
                depth: depth,
            }));

            return '';
        };

        server.context.di = di;

        server.context.a = di.api;
        server.context.m = di.models;

        server.context.methods = function(obj) {
            return Object.getOwnPropertyNames(obj).filter(function(p) {
                return typeof obj[p] === 'function';
            });
        };

        server.context.ensureIndexes = function() {
            return server.context.m.ensureIndexes();
        };
    })
    .catch((error) => {
        logger.fatal(error);
    });
