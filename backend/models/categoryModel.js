const db = require('../config/db');

exports.getAllCategories = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM categories", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.createCategory = (name) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO categories (name) VALUES (?)",
            [name],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};