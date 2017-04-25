var MongoClient = require('mongodb').MongoClient;

module.exports = (di) => {

    return new Promise((resolve, reject) => {

        return resolve();

        // init mongo db connection

        // MongoClient.connect(di.config.get('db.mongo.dsl'), di.config.get('db.mongo.options'))
        // .then((db) => {
        //
        //     // var Logger = require('mongodb').Logger;
        //     // Logger.setLevel('debug');
        //     // Logger.setCurrentLogger(function(msg, context) {
        //     //     di.logger.debug(msg, context);
        //     // });
        //
        //     di.db = {
        //         mongo: db
        //     };
        //
        //     resolve(di);
        //
        // })
        // .catch((error) => {
        //     di.logger.error(error);
        // });

    });

};
