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
    }

    async findOne({column, value}) {
        const query = stripAdditionalWhitespaces(
            `select * from ${this.tableName} where ${column} = $1`
        );

        try {
            return await db().oneOrNone(query, value);
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * Create a new item.
     */
    async create(item) {
        try {
            const columns = Object.keys(item);

            const query = stripAdditionalWhitespaces(
                `insert into ${this.tableName} (
                    ${columns.map(column => column)}
                ) values (
                    ${columns.map(column => `$/${column}/`)}
                )`
            );

            return await db().none(query, item);
        } catch (err) {
            console.log(`Error creating item for ${this.tableName}`, err); // eslint-disable-line no-console
        }
    }

    async update({column, value, where}) {
        const query = stripAdditionalWhitespaces(
            `update ${this.tableName} set ${column} = ${value} where ${where.column} = $1`
        );

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

        try {
            return await db().none(query, value);
        }
        catch (err) {
            console.log(`Error deleting item for ${this.tableName}`); // eslint-disable-line no-console
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

        await db().none(dropQuery);
        return await db().none(createQuery);
    }
}
