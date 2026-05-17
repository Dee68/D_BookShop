const pool = require("../backend/config/db");

async function tempUpdateUsers() {
    try {
        await pool.query(`
            UPDATE users
            SET email_verified = TRUE
            WHERE email_verified IS FALSE;`);
        console.log("Backfill Complete");
    } catch (error) {
        console.log("backfill failed", error.message);
    } finally{
        await pool.end();
    }
}

tempUpdateUsers();