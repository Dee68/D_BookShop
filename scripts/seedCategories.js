// const db = require('../backend/config/db');

// const categories = [
//     "Fiction",
//     "Non-Fiction",
//     "Science",
//     "Technology",
//     "Biography"
// ];

// categories.forEach(name => {
//     db.run(
//         `INSERT INTO categories (name) VALUES (?)`,
//         [name],
//         (err) => {
//             if (err) {
//                 console.log("Category error:", err.message);
//             } else {
//                 console.log("Inserted category:", name);
//             }
//         }
//     );
// });
//===postgress ===
require("dotenv").config();

const pool = require("../backend/config/db");

const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "Biography"
];

async function seedCategories() {
    try {
        for (const name of categories) {

            await pool.query(
                `INSERT INTO categories (name)
                 VALUES ($1)
                 ON CONFLICT (name) DO NOTHING`,
                [name]
            );

            console.log("Inserted category:", name);
        }

        console.log("Categories seeded successfully");

    } catch (err) {
        console.error("Category seeding failed:", err.message);
    } finally {
        await pool.end();
    }
}

seedCategories()
    .then(() => {
        console.log("Seed process completed");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });