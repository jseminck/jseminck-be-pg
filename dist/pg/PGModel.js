'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _db = require('./../db');

var _db2 = _interopRequireDefault(_db);

var _stripAdditionalWhitespaces = require('./stripAdditionalWhitespaces');

var _stripAdditionalWhitespaces2 = _interopRequireDefault(_stripAdditionalWhitespaces);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PGModel = function () {
    /**
     * {
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

        this.tableName = cfg.tableName;
        this.columns = cfg.columns;
        this.debug = cfg.debug;
    }

    _createClass(PGModel, [{
        key: 'printQuery',
        value: function printQuery() {
            if (this.debug) {
                [].concat(Array.prototype.slice.call(arguments)).forEach(function (arg) {
                    return console.log(arg);
                }); // eslint-disable-line no-console
            }
        }
    }, {
        key: 'findOne',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref) {
                var column = _ref.column;
                var value = _ref.value;
                var query, parsedValue;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                query = (0, _stripAdditionalWhitespaces2.default)(this.getFindQuery({ column: column, value: value }));
                                parsedValue = this.getParameters(value);

                                this.printQuery(query, parsedValue);

                                _context.prev = 3;
                                _context.next = 6;
                                return (0, _db2.default)().oneOrNone(query, parsedValue);

                            case 6:
                                return _context.abrupt('return', _context.sent);

                            case 9:
                                _context.prev = 9;
                                _context.t0 = _context['catch'](3);

                                console.log('Error finding one: ', _context.t0); // eslint-disable-line no-console
                                throw _context.t0;

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 9]]);
            }));

            function findOne(_x) {
                return ref.apply(this, arguments);
            }

            return findOne;
        }()
    }, {
        key: 'findAll',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                var column = _ref2.column;
                var value = _ref2.value;
                var limit = _ref2.limit;
                var orderBy = _ref2.orderBy;
                var query, parsedValue;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                query = (0, _stripAdditionalWhitespaces2.default)(this.getFindQuery({ column: column, value: value, limit: limit, orderBy: orderBy }));
                                parsedValue = this.getParameters(value);

                                this.printQuery(query, parsedValue);

                                _context2.prev = 3;
                                _context2.next = 6;
                                return (0, _db2.default)().many(query, parsedValue);

                            case 6:
                                return _context2.abrupt('return', _context2.sent);

                            case 9:
                                _context2.prev = 9;
                                _context2.t0 = _context2['catch'](3);

                                console.log('Error finding all: ', _context2.t0); // eslint-disable-line no-console
                                throw _context2.t0;

                            case 13:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[3, 9]]);
            }));

            function findAll(_x2) {
                return ref.apply(this, arguments);
            }

            return findAll;
        }()

        // If the value contains a between object, then we create a search query
        // that uses the between operator.

    }, {
        key: 'getFindQuery',
        value: function getFindQuery(_ref3) {
            var column = _ref3.column;
            var value = _ref3.value;
            var limit = _ref3.limit;
            var orderBy = _ref3.orderBy;

            var query = void 0;
            if (!column || !value) {
                query = 'select * from ' + this.tableName;
            } else if (value.between) {
                query = 'select * from ' + this.tableName + ' where ' + column + ' between $1 and $2';
            } else {
                query = 'select * from ' + this.tableName + ' where ' + column + ' = $1';
            }

            if (orderBy) {
                query = query + (' order by ' + orderBy);
            }

            if (limit) {
                query = query + (' limit ' + limit);
            }

            return query;
        }
    }, {
        key: 'getParameters',
        value: function getParameters(value) {
            if (!value) return;else if (value.between) {
                return [value.between.start, value.between.end];
            } else {
                return value;
            }
        }

        /**
         * Create a new item.
         */

    }, {
        key: 'create',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(item) {
                var columns, query;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                columns = Object.keys(item);
                                query = (0, _stripAdditionalWhitespaces2.default)('insert into ' + this.tableName + ' (\n                ' + columns.map(function (column) {
                                    return column;
                                }) + '\n            ) values (\n                ' + columns.map(function (column) {
                                    return '$/' + column + '/';
                                }) + '\n            )');


                                this.printQuery(query, item);

                                _context3.prev = 3;
                                _context3.next = 6;
                                return (0, _db2.default)().none(query, item);

                            case 6:
                                return _context3.abrupt('return', _context3.sent);

                            case 9:
                                _context3.prev = 9;
                                _context3.t0 = _context3['catch'](3);

                                console.log('Error creating item for ' + this.tableName, _context3.t0); // eslint-disable-line no-console
                                throw _context3.t0;

                            case 13:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[3, 9]]);
            }));

            function create(_x4) {
                return ref.apply(this, arguments);
            }

            return create;
        }()
    }, {
        key: 'update',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(_ref4) {
                var column = _ref4.column;
                var value = _ref4.value;
                var where = _ref4.where;
                var query;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                query = (0, _stripAdditionalWhitespaces2.default)('update ' + this.tableName + ' set ' + column + ' = ' + value + ' where ' + where.column + ' = $1');


                                this.printQuery(query, where.value);

                                _context4.prev = 2;
                                _context4.next = 5;
                                return (0, _db2.default)().oneOrNone(query, where.value);

                            case 5:
                                return _context4.abrupt('return', _context4.sent);

                            case 8:
                                _context4.prev = 8;
                                _context4.t0 = _context4['catch'](2);
                                throw _context4.t0;

                            case 11:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[2, 8]]);
            }));

            function update(_x5) {
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
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(_ref5) {
                var column = _ref5.column;
                var value = _ref5.value;
                var query;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                query = 'delete from ' + this.tableName + ' where ' + column + ' = $1';


                                this.printQuery(query, value);

                                _context5.prev = 2;
                                _context5.next = 5;
                                return (0, _db2.default)().none(query, value);

                            case 5:
                                return _context5.abrupt('return', _context5.sent);

                            case 8:
                                _context5.prev = 8;
                                _context5.t0 = _context5['catch'](2);

                                console.log('Error deleting item for ' + this.tableName); // eslint-disable-line no-console
                                throw _context5.t0;

                            case 12:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[2, 8]]);
            }));

            function remove(_x6) {
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
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
                var dropQuery, createColumn, createQuery;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                dropQuery = 'drop table if exists ' + this.tableName;

                                createColumn = function createColumn(column) {
                                    return '\n                ' + column.name + ' ' + column.type + '\n                ' + (column.null ? ' ' : '&nbsp;not null') + '\n                ' + (column.default ? '&nbsp;default ' + column.default : ' ');
                                };

                                createQuery = (0, _stripAdditionalWhitespaces2.default)('create table ' + this.tableName + ' (\n                ' + this.columns.map(createColumn) + '\n            )');
                                _context6.next = 5;
                                return (0, _db2.default)().none(dropQuery);

                            case 5:
                                _context6.next = 7;
                                return (0, _db2.default)().none(createQuery);

                            case 7:
                                return _context6.abrupt('return', _context6.sent);

                            case 8:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
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