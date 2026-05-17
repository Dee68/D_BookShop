//require("dotenv").config();
const pool = require("../backend/config/db");

async function updateUsers() {
    try {

        await pool.query(`
            ALTER TABLE users

            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            ADD COLUMN IF NOT EXISTS profile_image TEXT,

            ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,

            ADD COLUMN IF NOT EXISTS verification_token TEXT,

            ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP,

            ADD COLUMN IF NOT EXISTS phone TEXT,

            ADD COLUMN IF NOT EXISTS address TEXT;
        `);

        console.log("Users table updated successfully");

    } catch (error) {

        console.error("Update users failed:", error.message);

    } finally {

        await pool.end();
    }
}

updateUsers();