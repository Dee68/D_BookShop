require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_PUBLIC_URL });

(async () => {
    try {
        await pool.query(`
            ALTER TABLE users
                ADD COLUMN IF NOT EXISTS email_verified       BOOLEAN   DEFAULT FALSE,
                ADD COLUMN IF NOT EXISTS verification_token   TEXT,
                ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP
        `);
        console.log('users table patched');

        // Now flip the admin to verified
        const r = await pool.query(
            `UPDATE users SET email_verified = TRUE
             WHERE role = 'admin'
             RETURNING id, email, role, email_verified`
        );
        console.log('Admin rows updated:', r.rows);
    } catch (e) {
        console.error('FAIL', e.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();