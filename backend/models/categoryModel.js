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
exports.updateCategory = (id, name) => {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE categories SET name = ? WHERE id = ?",
            [name, id],
            function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            }
        );
    });
};

exports.deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            "DELETE FROM categories WHERE id = ?",
            [id],
            function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            }
        );
    });
};

exports.getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM categories WHERE id = ?",
            [id],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
};