const pool = require("../backend/config/db");

async function resetAdmin() {
    try {
        const email = "admin@dbookshop.com";

        const result = await pool.query(
            "DELETE FROM users WHERE email = $1",
            [email]
        );

        console.log(`Deleted ${result.rowCount} admin user(s)`);
    } catch (err) {
        console.error("Reset admin failed:", err.message);
    }
}

module.exports = resetAdmin();