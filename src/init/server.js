var express = require('express');
var cors = require('cors');
var morgan = require('morgan');

module.exports = function (di) {
    var app = express();

    app.di = di;

    app.disable('x-powered-by');
    app.disable('etag');

    app.use(morgan('combined'));

    app.use(function (req, res, next) {

        req.debug = true;

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
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
    }));

    // init.nprof(di.logger, app, di.config.get('nprof'));

    return app;
};
