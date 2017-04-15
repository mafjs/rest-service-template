var log4js = require('log4js-nested');

module.exports = function () {
    return log4js.getLogger('rest-api');
};
