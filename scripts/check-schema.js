require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

(async () => {
    try {
        const r = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position
        `);
        console.table(r.rows);
    } catch (e) {
        console.error('FAIL', e.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();