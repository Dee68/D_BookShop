const db = require('../config/db');

exports.createProduct = (product) => {
    const { title, author, price, category_id, stock, images } = product;

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO products (title, author, price, category_id, stock)
             VALUES (?, ?, ?, ?, ?)`,
            [title, author, price, category_id, stock],
            function (err) {
                if (err) return reject(err);

                const productId = this.lastID;

                // Insert images
                if (images && images.length > 0) {
                    const stmt = db.prepare(
                        `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`
                    );

                    images.forEach(img => {
                        stmt.run(productId, img);
                    });

                    stmt.finalize();
                }

                resolve({ id: productId });
            }
        );
    });
};

exports.getAllProducts = () => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT p.*, pi.image_url
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        `;

        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);

            // Group images per product
            const products = {};

            rows.forEach(row => {
                if (!products[row.id]) {
                    products[row.id] = {
                        id: row.id,
                        title: row.title,
                        author: row.author,
                        price: row.price,
                        category_id: row.category_id,
                        stock: row.stock,
                        images: []
                    };
                }

                if (row.image_url) {
                    products[row.id].images.push(row.image_url);
                }
            });

            resolve(Object.values(products));
        });
    });
};

exports.getProductById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT p.*, pi.image_url
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.id = ?
        `;

        db.all(sql, [id], (err, rows) => {
            if (err) return reject(err);

            if (rows.length === 0) return resolve(null);

            const product = {
                id: rows[0].id,
                title: rows[0].title,
                author: rows[0].author,
                price: rows[0].price,
                category_id: rows[0].category_id,
                stock: rows[0].stock,
                images: []
            };

            rows.forEach(r => {
                if (r.image_url) product.images.push(r.image_url);
            });

            resolve(product);
        });
    });
};

exports.updateProduct = (id, product) => {
    const { title, author, price, category_id, stock } = product;

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE products
             SET title=?, author=?, price=?, category_id=?, stock=?
             WHERE id=?`,
            [title, author, price, category_id, stock, id],
            function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            }
        );
    });
};

exports.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            `DELETE FROM products WHERE id = ?`,
            [id],
            function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            }
        );
    });
};