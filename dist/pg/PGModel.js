'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stripAdditionalWhitespaces = require('./stripAdditionalWhitespaces');

var _stripAdditionalWhitespaces2 = _interopRequireDefault(_stripAdditionalWhitespaces);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PGModel = function () {
    /**
     * {
     *     db: {PGP Object}
     *     tableName: "users",
     *     columns: [
     *         {name: "id", type: "serial"},
     *         {name: "username", type: "varchar(128)"},
     *         {name: "password", type: "varchar(128)"},
     *         {name: "data", type: "jsonb"},
     *         {name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP"},
     *         {name: "last_login", type: "timestamp"}
     *     ]
     * }
     */

    function PGModel(cfg) {
        _classCallCheck(this, PGModel);

        this.db = cfg.db;
        this.tableName = cfg.tableName;
        this.columns = cfg.columns;
    }

    _createClass(PGModel, [{
        key: 'findOne',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref) {
                var column = _ref.column;
                var value = _ref.value;
                var query;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                query = (0, _stripAdditionalWhitespaces2.default)('select * from ' + this.tableName + ' where ' + column + ' = $1');
                                _context.prev = 1;
                                _context.next = 4;
                                return db.oneOrNone(query, value);

                            case 4:
                                return _context.abrupt('return', _context.sent);

                            case 7:
                                _context.prev = 7;
                                _context.t0 = _context['catch'](1);
                                throw _context.t0;

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[1, 7]]);
            }));

            function findOne(_x) {
                return ref.apply(this, arguments);
            }

            return findOne;
        }()

        /**
         * Create a new item.
         */

    }, {
        key: 'create',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(item) {
                var columns, query;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;
                                columns = Object.keys(item);
                                query = (0, _stripAdditionalWhitespaces2.default)('insert into ' + this.tableName + ' (\n                    ' + columns.map(function (column) {
                                    return column;
                                }) + '\n                ) values (\n                    ' + columns.map(function (column) {
                                    return '$/' + column + '/';
                                }) + '\n                )');
                                _context2.next = 5;
                                return db.none(query, item);

                            case 5:
                                return _context2.abrupt('return', _context2.sent);

                            case 8:
                                _context2.prev = 8;
                                _context2.t0 = _context2['catch'](0);

                                console.log('Error creating item for ' + this.tableName, _context2.t0); // eslint-disable-line no-console

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 8]]);
            }));

            function create(_x2) {
                return ref.apply(this, arguments);
            }

            return create;
        }()
    }, {
        key: 'update',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(_ref2) {
                var column = _ref2.column;
                var value = _ref2.value;
                var where = _ref2.where;
                var query;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                query = (0, _stripAdditionalWhitespaces2.default)('update ' + this.tableName + ' set ' + column + ' = ' + value + ' where ' + where.column + ' = $1');
                                _context3.prev = 1;
                                _context3.next = 4;
                                return db.oneOrNone(query, where.value);

                            case 4:
                                return _context3.abrupt('return', _context3.sent);

                            case 7:
                                _context3.prev = 7;
                                _context3.t0 = _context3['catch'](1);
                                throw _context3.t0;

                            case 10:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[1, 7]]);
            }));

            function update(_x3) {
                return ref.apply(this, arguments);
            }

            return update;
        }()

        /**
         * Remove an item from the database by id.
         */

    }, {
        key: 'remove',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref3) {
                var column = _ref3.column;
                var value = _ref3.value;
                var query;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                query = 'delete from ' + this.tableName + ' where ' + column + ' = $1';
                                _context4.prev = 1;
                                _context4.next = 4;
                                return db.none(query, value);

                            case 4:
                                return _context4.abrupt('return', _context4.sent);

                            case 7:
                                _context4.prev = 7;
                                _context4.t0 = _context4['catch'](1);

                                console.log('Error deleting item for ' + this.tableName); // eslint-disable-line no-console

                            case 10:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[1, 7]]);
            }));

            function remove(_x4) {
                return ref.apply(this, arguments);
            }

            return remove;
        }()

        /**
         * Drop and recreate the table. This will remove all data!
         */

    }, {
        key: '__recreate',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
                var dropQuery, createColumn, createQuery;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                dropQuery = 'drop table if exists ' + this.tableName;

                                createColumn = function createColumn(column) {
                                    return '\n                ' + column.name + ' ' + column.type + '\n                ' + (column.null ? ' ' : '&nbsp;not null') + '\n                ' + (column.default ? '&nbsp;default ' + column.default : ' ');
                                };

                                createQuery = (0, _stripAdditionalWhitespaces2.default)('create table ' + this.tableName + ' (\n                ' + this.columns.map(createColumn) + '\n            )');
                                _context5.next = 5;
                                return db.none(dropQuery);

                            case 5:
                                _context5.next = 7;
                                return db.none(createQuery);

                            case 7:
                                return _context5.abrupt('return', _context5.sent);

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function __recreate() {
                return ref.apply(this, arguments);
            }

            return __recreate;
        }()
    }]);

    return PGModel;
}();

exports.default = PGModel;
;