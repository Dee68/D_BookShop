require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

(async () => {
    try {
        const r = await pool.query(
            'SELECT id, email, role, email_verified FROM users WHERE role = $1',
            ['admin']
        );
        console.log(r.rows);
    } catch (e) {
        console.error('FAIL', e.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();