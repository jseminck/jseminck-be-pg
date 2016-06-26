import pgp from 'pg-promise';

let dbConnection;
/**
 * var cn = {
 *     host: 'localhost',
 *     port: 5432,
 *     database: 'aws',
 *     username: 'postgres',
 *     password: ''
 * };
 */
export default function db(cn) {
    if (!dbConnection) {
        // Parse integers so they are not returned as stirng.
        pgp.pg.types.setTypeParser(1700, val => parseFloat(val));
        pgp.pg.types.setTypeParser(20, val => parseInt(val));
        dbConnection = pgp()(process.env.DATABASE_URL || cn);
    }

    return dbConnection;
}