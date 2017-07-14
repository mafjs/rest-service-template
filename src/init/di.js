'use strict';

class RequestDebug {

    constructor () {
        this._log = [];
    }

    log (data) {
        this._log.push(data);
    }

    get () {
        return this._log;
    }
}


var init = {
    db: require('./db'),
    models: require('../models'),
    api: require('../api'),
    hapi: require('../hapi')
};

var initDi = function (logger, config) {

    return new Promise((resolve, reject) => {

        var di = {
            logger: logger,
            config: config
        };

        Promise.resolve()
            .then(() => {
                return init.db(di);
            })
            .then(() => {
                return init.models(di);
            })
            .then(() => {
                return init.api(di);
            })
            .then(() => {
                return init.hapi(di);
            })
            .then(() => {
                resolve(di);
            })
            .catch((error) => {
                reject(error);
            });

    });

};

initDi.debug = function (di) {

    return new Promise((resolve, reject) => {

        var debugDi = {
            logger: di.logger,
            config: di.config,
            debug: new RequestDebug(),
            ssh: di.ssh,
            db: di.db
        };

        Promise.resolve()
            .then(() => {
                return init.models(debugDi);
            })
            .then(() => {
                return init.api(debugDi);
            })
            .then(() => {
                resolve(debugDi);
            })
            .catch((error) => {
                reject(error);
            });

    });

};


module.exports = initDi;
