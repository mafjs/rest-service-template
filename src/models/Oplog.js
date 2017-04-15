'use strict';

var ModelAbstract = require('maf-model-mongo');

class OplogModel extends ModelAbstract {

    constructor (db) {
        super(db);

        this._collectionName = 'oplog';

        this._indexes = [];
    }

}

module.exports = OplogModel;
