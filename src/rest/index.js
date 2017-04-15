var Rest = require('maf-rest');

module.exports = function (di, app) {

    return new Promise((resolve, reject) => {

        var rest = new Rest(di.logger.getLogger('rest'));

        rest = require(`${__dirname}/responseHelpers`)(rest);
        rest = require(`${__dirname}/middlewares`)(rest);

        rest.setEndpoint('/api/v0');

        var resources = [

            {
                'GET /': function (req, res) {
                    res.result({
                        title: 'api'
                    });
                }
            }

            // add rest api resources here

        ];

        var promises = [];

        for (var i in resources) {
            promises.push(rest.addMethods(resources[i]));
        }

        Promise.all(promises)
            .then(() => {
                return rest.init(app, di);
            })
            .then(() => {
                resolve(app);
            })
            .catch((error) => {
                reject(error);
            });

    });

};
