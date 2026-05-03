const db = require('../config/db');

function replaceImages(id, images) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`DELETE FROM product_images WHERE product_id = ?`, [id], (err) => {
                if (err) return reject(err);

                const stmt = db.prepare(
                    `INSERT INTO product_images (product_id, image_url)
                     VALUES (?, ?)`
                );

                images.forEach(img => {
                    stmt.run(id, img);
                });

                stmt.finalize(err => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
    });
};
exports.replaceImages = replaceImages;

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

exports.getFilteredProducts = (filters) => {
    const { search, category, minPrice, maxPrice, limit, offset } = filters;

    let sql = `
    SELECT p.*, pi.image_url
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE 1=1
    `;

    const params = [];

    if (search) {
        sql += ` AND (p.title LIKE ? OR p.author LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
        sql += ` AND p.category_id = ?`;
        params.push(category);
    }

    if (minPrice) {
        sql += ` AND p.price >= ?`;
        params.push(minPrice);
    }

    if (maxPrice) {
        sql += ` AND p.price <= ?`;
        params.push(maxPrice);
    }

    sql += ` ORDER BY p.id DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);

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

exports.getProductByIdSimple = (id) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM products WHERE id = ?`,
            [id],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
};
exports.restoreStock = (product_id, quantity) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE products
             SET stock = stock + ?
             WHERE id = ?`,
            [quantity, product_id],
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
};
exports.reduceStock = (product_id, quantity) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE products
             SET stock = stock - ?
             WHERE id = ?`,
            [quantity, product_id],
            function (err) {
                if (err) reject(err);
                else resolve();
            }
        );
    });
};

exports.updateProduct = (id, product, images) => {
    const { title, author, price, category_id, stock } = product;

    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE products
             SET title=?, author=?, price=?, category_id=?, stock=?
             WHERE id=?`,
            [title, author, price, category_id, stock, id],
            function (err) {
                if (err) return reject(err);

                // OPTIONAL: replace images
                if (images && images.length > 0) {
                  replaceImages(id, images).then(()=>{resolve({changes:this.changes});}).catch(reject);
                }

                resolve({ changes: this.changes });
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

exports.countFilteredProducts = (filters) => {
    const { search, category, minPrice, maxPrice } = filters;

    let sql = `SELECT COUNT(DISTINCT p.id) as count FROM products p WHERE 1=1`;
    const params = [];

    if (search) {
        sql += ` AND (p.title LIKE ? OR p.author LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
        sql += ` AND p.category_id = ?`;
        params.push(category);
    }

    if (minPrice) {
        sql += ` AND p.price >= ?`;
        params.push(minPrice);
    }

    if (maxPrice) {
        sql += ` AND p.price <= ?`;
        params.push(maxPrice);
    }

    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row.count);
        });
    });
};