let express = require('express');
let cors = require('cors');
let morgan = require('morgan');
let rfs = require('rotating-file-stream');

module.exports = function(di) {
    let app = express();

    app.di = di;

    app.disable('x-powered-by');
    app.disable('etag');
    app.set('trust proxy', 'loopback, uniquelocal');

    let accessLogStream = rfs('access.log', {
        interval: '1d',
        path: '/var/log/app',
    });

    let accessLogFormat = [
        ':remote-addr',
        ':remote-user',
        '[:date[clf]]',
        ':method',
        ':url',
        'HTTP/:http-version',
        ':status',
        ':res[content-length]',
        ':response-time',
        ':referrer',
        ':user-agent',
    ];

    accessLogFormat = accessLogFormat.join('\t');

    app.use(morgan(accessLogFormat, {stream: accessLogStream}));

    app.use(function(req, res, next) {
        if (process.env.NODE_ENV === 'production') {
            req.debug = false;
        } else if (process.env.NODE_ENV === 'dev') {
            req.debug = true;
        }

        if (req.debug === true) {
            require('./di').debug(di)
                .then((debugDi) => {
                    req.di = debugDi;
                    next();
                })
                .catch((error) => {
                    next(error);
                });
        } else {
            req.di = di;
            next();
        }
    });

    app.use(cors({
        preflightContinue: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    }));

    // init.nprof(di.logger, app, di.config.get('nprof'));

    return app;
};
