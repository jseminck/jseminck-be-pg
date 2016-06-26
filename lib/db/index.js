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
        const pgpInstance = pgp();

        parseNumericToNumber(pgpInstance);

        dbConnection = pgpInstance(process.env.DATABASE_URL || cn);
    }

    return dbConnection;
}

function parseNumericToNumber(pgpInstance) {
    pgpInstance.pg.types.setTypeParser(1700, (val) => Number(val));
}