const db = require('../config/db');

exports.getAllProducts = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM products", [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.createProduct = (product) => {
    const { title, author, price, category_id, stock } = product;

    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO products (title, author, price, category_id, stock)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.run(sql, [title, author, price, category_id, stock], function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
        });
    });
};