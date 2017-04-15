var ServiceLocator = require('maf-service-locator');


module.exports = function (di) {

    return new Promise((resolve, reject) => {
        var models = new ServiceLocator();

        // models.set('oplog', function () {
        //     var Model = require('./Oplog');
        //
        //     var model = new Model(di.db.mongo);
        //
        //     model.init();
        //
        //     if (di.debug) {
        //         model.setDebug(di.debug);
        //     }
        //
        //     return model;
        // });

        models.ensureIndexes = function () {
            var names = models.getNames();

            var promises = [];

            for (var name of names) {
                promises.push(models.get(name).ensureIndexes());
            }

            return Promise.all(promises);
        };

        di.models = models;

        resolve(di);

    });

};
