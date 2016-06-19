'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PGModel = exports.db = undefined;

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

var _PGModel = require('./pg/PGModel');

var _PGModel2 = _interopRequireDefault(_PGModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.db = _db2.default;
exports.PGModel = _PGModel2.default;