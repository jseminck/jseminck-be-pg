import db from './../db';
import stripAdditionalWhitespaces from './stripAdditionalWhitespaces';

export default class PGModel {
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
    constructor(cfg) {
        this.tableName = cfg.tableName;
        this.columns = cfg.columns;
        this.debug = cfg.debug;
    }

    printQuery() {
        if (this.debug) {
            [...arguments].forEach(arg => console.log(arg)); // eslint-disable-line no-console
        }
    }

    async findOne({column, value}) {
        const query = stripAdditionalWhitespaces(this.getFindQuery({column, value}));

        const parsedValue = this.getParameters(value);
        this.printQuery(query, parsedValue);

        try {
            return await db().oneOrNone(query, parsedValue);
        }
        catch (err) {
            console.log(`Error finding one: `, err); // eslint-disable-line no-console
            throw err;
        }
    }

    async findAll({column, value}) {
        const query = stripAdditionalWhitespaces(this.getFindQuery({column, value}));

        const parsedValue = this.getParameters(value);
        this.printQuery(query, parsedValue);

        try {
            return await db().many(query, parsedValue);
        }
        catch (err) {
            console.log(`Error finding all: `, err); // eslint-disable-line no-console
            throw err;
        }
    }

    // If the value contains a between object, then we create a search query
    // that uses the between operator.
    getFindQuery({column, value}) {
        if (value.between) {
            return `select * from ${this.tableName} where ${column} between $1 and $2`;
        }
        else {
            return `select * from ${this.tableName} where ${column} = $1`;
        }
    }

    getParameters(value) {
        if (value.between) {
            return [value.between.start, value.between.end];
        }
        else {
            return value;
        }
    }

    /**
     * Create a new item.
     */
    async create(item) {
        const columns = Object.keys(item);

        const query = stripAdditionalWhitespaces(
            `insert into ${this.tableName} (
                ${columns.map(column => column)}
            ) values (
                ${columns.map(column => `$/${column}/`)}
            )`
        );

        this.printQuery(query, item);

        try {
            return await db().none(query, item);
        } catch (err) {
            console.log(`Error creating item for ${this.tableName}`, err); // eslint-disable-line no-console
            throw err;
        }
    }

    async update({column, value, where}) {
        const query = stripAdditionalWhitespaces(
            `update ${this.tableName} set ${column} = ${value} where ${where.column} = $1`
        );

        this.printQuery(query, where.value);

        try {
            return await db().oneOrNone(query, where.value);
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * Remove an item from the database by id.
     */
    async remove({column, value}) {
        let query =
            `delete from ${this.tableName} where ${column} = $1`;

        this.printQuery(query, value);

        try {
            return await db().none(query, value);
        }
        catch (err) {
            console.log(`Error deleting item for ${this.tableName}`); // eslint-disable-line no-console
            throw err;
        }
    }

    /**
     * Drop and recreate the table. This will remove all data!
     */
    async __recreate() {
        const dropQuery = `drop table if exists ${this.tableName}`;

        const createColumn = function(column) {
            return `
                ${column.name} ${column.type}
                ${column.null ? ` ` : `&nbsp;not null`}
                ${column.default ? `&nbsp;default ${column.default}` : ` `}`;
        };

        const createQuery = stripAdditionalWhitespaces(
            `create table ${this.tableName} (
                ${this.columns.map(createColumn)}
            )`
        );

        console.log("Dropping table: ", dropQuery);
        console.log("Create table", createQuery);

        await db().none(dropQuery);
        return await db().none(createQuery);
    }
}
