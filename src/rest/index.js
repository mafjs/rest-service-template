let Rest = require('maf-rest');

module.exports = function(di, app) {
    return new Promise((resolve, reject) => {
        let rest = new Rest(di.logger.getLogger('rest'));

        rest = require(`${__dirname}/responseHelpers`)(rest);
        rest = require(`${__dirname}/middlewares`)(rest);

        rest.setEndpoint('/api/v0');

        let resources = [

            {
                'GET /': function(req, res) {
                    res.result({
                        title: 'api',
                    });
                },
            },

            // add rest api resources here

        ];

        let promises = [];

        Object.keys(resources).forEach((i) => {
            promises.push(rest.addMethods(resources[i]));
        });

        Promise.all(promises)
            .then(() => {
                return rest.initApp(app, di);
            })
            .then(() => {
                return rest.initMethods(app, di);
            })
            .then(() => {
                resolve(app);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
