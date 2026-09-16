const db = require('../backend/config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        const email = 'admin@bookshop.com';

        // Check whether admin already exists
        db.get(
            `SELECT id FROM users WHERE email = ?`,
            [email],
            async (err, existingUser) => {

                if (err) {
                    console.error('Error checking admin:', err.message);
                    return;
                }

                if (existingUser) {
                    console.log('Admin already exists');
                    return;
                }

                const password = await bcrypt.hash('admin123', 10);

                db.run(
                    `INSERT INTO users (
                        name,
                        email,
                        password,
                        role,
                        email_verified
                    )
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        'Admin',
                        email,
                        password,
                        'admin',
                        1
                    ],
                    function (err) {

                        if (err) {
                            console.error('Error creating admin:', err.message);
                            return;
                        }

                        console.log(`Admin created successfully (ID: ${this.lastID})`);
                    }
                );
            }
        );

    } catch (error) {
        console.error('Seed error:', error.message);
    }
}

createAdmin();

//== Postgresql ======
// require("dotenv").config();
// const bcrypt = require("bcrypt");
// const pool = require("../backend/config/db");

// async function seedAdmin() {
//     const existing = await pool.query(
//         "SELECT * FROM users WHERE email = $1",
//         [process.env.ADMIN_EMAIL]
//     );

//     if (existing.rows.length > 0) {
//         console.log("Admin already exists");
//         return;
//     }

//     const hashedPassword = await bcrypt.hash(
//         process.env.ADMIN_PASSWORD,
//         10
//     );

//     await pool.query(
//         `INSERT INTO users (name, email, password, role)
//          VALUES ($1, $2, $3, $4)`,
//         [
//             "Admin",
//             process.env.ADMIN_EMAIL,
//             hashedPassword,
//             "admin"
//         ]
//     );

//     console.log("Admin user created successfully");
// }

// //module.exports = seedAdmin;
// seedAdmin()
//     .then(() => {
//         console.log("Seed process completed");
//         process.exit(0);
//     })
//     .catch((err) => {
//         console.error(err);
//         process.exit(1);
//     });