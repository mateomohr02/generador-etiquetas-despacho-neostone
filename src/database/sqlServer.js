const sql = require('mssql');

const config = {
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    options: {
        instanceName: process.env.SQL_INSTANCE_NAME,
        encrypt: process.env.SQL_ENCRYPT === 'true',
        trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE === 'true'
    }
};

let pool = null;

async function getPool() {
    if (pool) return pool;
    pool = await sql.connect(config);
    return pool;
}

module.exports = {
    getPool,
    sql
};
