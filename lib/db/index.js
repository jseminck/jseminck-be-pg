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
        dbConnection = pgp()(process.env.DATABASE_URL || cn);
    }

    return dbConnection;
}