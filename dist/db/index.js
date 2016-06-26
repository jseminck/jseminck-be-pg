'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = db;

var _pgPromise = require('pg-promise');

var _pgPromise2 = _interopRequireDefault(_pgPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbConnection = void 0;
/**
 * var cn = {
 *     host: 'localhost',
 *     port: 5432,
 *     database: 'aws',
 *     username: 'postgres',
 *     password: ''
 * };
 */
function db(cn) {
    if (!dbConnection) {
        // Parse integers so they are not returned as stirng.
        _pgPromise2.default.pg.types.setTypeParser(1700, function (val) {
            return parseFloat(val);
        });
        _pgPromise2.default.pg.types.setTypeParser(20, function (val) {
            return parseInt(val);
        });
        dbConnection = (0, _pgPromise2.default)()(process.env.DATABASE_URL || cn);
    }

    return dbConnection;
}