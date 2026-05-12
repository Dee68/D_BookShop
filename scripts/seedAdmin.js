// const db = require('../backend/config/db');
// const bcrypt = require('bcrypt');

// async function createAdmin() {
//     const password = await bcrypt.hash('admin123', 10);

//     db.run(
//         `INSERT INTO users (name, email, password, role)
//          VALUES (?, ?, ?, ?)`,
//         ['Admin', 'admin@bookshop.com', password, 'admin'],
//         (err) => {
//             if (err) console.log(err.message);
//             else console.log('Admin created');
//         }
//     );
// }

// createAdmin();
//== Postgresql ======
const bcrypt = require("bcrypt");
const pool = require("../backend/config/db");

async function seedAdmin() {
    const existing = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [process.env.ADMIN_EMAIL]
    );

    if (existing.rows.length > 0) {
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
    );

    await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)`,
        [
            "Admin",
            process.env.ADMIN_EMAIL,
            hashedPassword,
            "admin"
        ]
    );

    console.log("Admin user created successfully");
}

module.exports = seedAdmin;