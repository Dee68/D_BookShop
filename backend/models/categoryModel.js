const db = require('../config/db');

exports.getAllCategories = (page = 1, limit = 5) => {

    return new Promise((resolve, reject) => {
 
        const offset = (page - 1) * limit;

         const sqlCount = `SELECT COUNT(*) AS count FROM categories`;

         db.get(sqlCount, [], (err, countResult) => {
            if (err) return reject(err);

            const total = countResult.count;

            const sqlData = `
                SELECT *
                FROM categories
                ORDER BY id ASC
                LIMIT ?
                OFFSET ?
            `;

            db.all(sqlData, [limit, offset], (err, rows) => {
                if (err) return reject(err);

                resolve({
                    data: rows,
                    total
                });
            });
        });

    });
};

exports.getCategoriesForStore = () => {

    return new Promise((resolve, reject) => {

        const sql = `
            SELECT *
            FROM categories
            ORDER BY name ASC
        `;

        db.all(sql, [], (err, rows) => {

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