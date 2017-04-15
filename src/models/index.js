var ServiceLocator = require('maf-service-locator');


module.exports = function (di) {

    return new Promise((resolve, reject) => {
        var models = new ServiceLocator();

        // init models here

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
