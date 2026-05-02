const db = require('../backend/config/db');

const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "Technology",
    "Biography"
];

categories.forEach(name => {
    db.run(
        `INSERT INTO categories (name) VALUES (?)`,
        [name],
        (err) => {
            if (err) {
                console.log("Category error:", err.message);
            } else {
                console.log("Inserted category:", name);
            }
        }
    );
});