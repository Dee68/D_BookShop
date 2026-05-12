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
    try {

        const email = "admin@dbookshop.com";
        const password = "Admin123!";
        const hashedPassword = await bcrypt.hash(password, 10);

        // check if admin exists
        const existing = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if (existing.rows.length > 0) {
            console.log("Admin already exists");
            process.exit();
        }

        await pool.query(
            `
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            `,
            [
                "Admin",
                email,
                hashedPassword,
                "admin"
            ]
        );

        console.log("Admin user created successfully");

        process.exit();

    } catch (err) {

        console.error(err);
        process.exit(1);
    }
}

seedAdmin();