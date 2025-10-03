import pkg from 'pg';
const {Pool} = pkg;
const pool = new Pool({
    user: 'your-user-name',
    host: 'host-name(eg,localhost)',
    database: 'your-db-name',
    password:'your-password',
    port: 'port-number',
});

export default pool;