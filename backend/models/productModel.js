const db = require('../config/db');
 
// function replaceImages(id, images) {
//     return new Promise((resolve, reject) => {
//         db.serialize(() => {
//             db.run(`DELETE FROM product_images WHERE product_id = ?`, [id], (err) => {
//                 if (err) return reject(err);

//                 const stmt = db.prepare(
//                     `INSERT INTO product_images (product_id, image_url)
//                      VALUES (?, ?)`
//                 );

//                 images.forEach(img => {
//                     stmt.run(id, img);
//                 });

//                 stmt.finalize(err => {
//                     if (err) reject(err);
//                     else resolve();
//                 });
//             });
//         });
//     });
// };
// exports.replaceImages = replaceImages;

// exports.createProduct = (product) => {
//     const { title, author, price, category_id, stock, images } = product;

//     return new Promise((resolve, reject) => {
//         db.run(
//             `INSERT INTO products (title, author, price, category_id, stock)
//              VALUES (?, ?, ?, ?, ?)`,
//             [title, author, price, category_id, stock],
//             function (err) {
//                 if (err) return reject(err);

//                 const productId = this.lastID;

//                 // Insert images
//                 if (images && images.length > 0) {
//                     const stmt = db.prepare(
//                         `INSERT INTO product_images (product_id, image_url) VALUES (?, ?)`
//                     );

//                     images.forEach(img => {
//                         stmt.run(productId, img);
//                     });

//                     stmt.finalize();
//                 }

//                 resolve({ id: productId });
//             }
//         );
//     });
// };
 
// exports.getFilteredProducts = (filters) => {
//     const { search, category, minPrice, maxPrice, limit, offset } = filters;

//     let sql = `
//     SELECT 
//         p.id,
//         p.title,
//         p.author,
//         p.price,
//         p.category_id,
//         p.stock,
//         pi.image_url
//     FROM (
//         SELECT *
//         FROM products
//         WHERE 1=1
//     `;

//     const params = [];

//     if (search) {
//         sql += ` AND (title LIKE ? OR author LIKE ?)`;
//         params.push(`%${search}%`, `%${search}%`);
//     }

//     if (category) {
//         sql += ` AND category_id = ?`;
//         params.push(category);
//     }

//     if (minPrice) {
//         sql += ` AND price >= ?`;
//         params.push(minPrice);
//     }

//     if (maxPrice) {
//         sql += ` AND price <= ?`;
//         params.push(maxPrice);
//     }

//     sql += `
//         ORDER BY id DESC
//         LIMIT ? OFFSET ?
//     ) p
//     LEFT JOIN product_images pi
//     ON p.id = pi.product_id
//     `;

//     params.push(limit, offset);

//     return new Promise((resolve, reject) => {
//         db.all(sql, params, (err, rows) => {
//             if (err) return reject(err);

//             const products = {};

//             rows.forEach(row => {
//                 if (!products[row.id]) {
//                     products[row.id] = {
//                         id: row.id,
//                         title: row.title,
//                         author: row.author,
//                         price: row.price,
//                         category_id: row.category_id,
//                         stock: row.stock,
//                         images: []
//                     };
//                 }

//                 if (row.image_url) {
//                     products[row.id].images.push(row.image_url);
//                 }
//             });

//             resolve(Object.values(products));
//         });
//     });
// };

// exports.getProductById = (id) => {
//     return new Promise((resolve, reject) => {
//         const sql = `
//         SELECT p.*, pi.image_url
//         FROM products p
//         LEFT JOIN product_images pi ON p.id = pi.product_id
//         WHERE p.id = ?
//         `;

//         db.all(sql, [id], (err, rows) => {
//             if (err) return reject(err);

//             if (rows.length === 0) return resolve(null);

//             const product = {
//                 id: rows[0].id,
//                 title: rows[0].title,
//                 author: rows[0].author,
//                 price: rows[0].price,
//                 category_id: rows[0].category_id,
//                 stock: rows[0].stock,
//                 images: []
//             };

//             rows.forEach(r => {
//                 if (r.image_url) product.images.push(r.image_url);
//             });

//             resolve(product);
//         });
//     });
// };

// exports.getAllProducts = () => {

//     return new Promise((resolve, reject) => {

//         const sql = `
//             SELECT
//                 p.id,
//                 p.title,
//                 p.price,
//                 p.stock,
//                 c.name AS category_name
//             FROM products p
//             LEFT JOIN categories c
//                 ON p.category_id = c.id
//             ORDER BY p.id DESC
//         `;

//         db.all(sql, [], (err, rows) => {

//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// };

// exports.getProductByIdSimple = (id) => {
//     return new Promise((resolve, reject) => {
//         db.get(
//             `SELECT * FROM products WHERE id = ?`,
//             [id],
//             (err, row) => {
//                 if (err) reject(err);
//                 else resolve(row);
//             }
//         );
//     });
// };
// exports.restoreStock = (product_id, quantity) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             `UPDATE products
//              SET stock = stock + ?
//              WHERE id = ?`,
//             [quantity, product_id],
//             function (err) {
//                 if (err) reject(err);
//                 else resolve();
//             }
//         );
//     });
// };
// exports.reduceStock = (product_id, quantity) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             `UPDATE products
//              SET stock = stock - ?
//              WHERE id = ?`,
//             [quantity, product_id],
//             function (err) {
//                 if (err) reject(err);
//                 else resolve();
//             }
//         );
//     });
// };

// exports.updateProduct = (id, product, images) => {
//     const { title, author, price, category_id, stock } = product;

//     return new Promise((resolve, reject) => {
//         db.run(
//             `UPDATE products
//              SET title=?, author=?, price=?, category_id=?, stock=?
//              WHERE id=?`,
//             [title, author, price, category_id, stock, id],
//             function (err) {
//                 if (err) return reject(err);

//                 // OPTIONAL: replace images
//                 if (images && images.length > 0) {
//                   replaceImages(id, images).then(()=>{resolve({changes:this.changes});}).catch(reject);
//                 }

//                 resolve({ changes: this.changes });
//             }
//         );
//     });
// };

// exports.deleteProduct = (id) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             `DELETE FROM products WHERE id = ?`,
//             [id],
//             function (err) {
//                 if (err) reject(err);
//                 else resolve({ changes: this.changes });
//             }
//         );
//     });
// };

// exports.countFilteredProducts = (filters) => {
//     const { search, category, minPrice, maxPrice } = filters;

//     let sql = `SELECT COUNT(DISTINCT p.id) as count FROM products p WHERE 1=1`;
//     const params = [];

//     if (search) {
//         sql += ` AND (p.title LIKE ? OR p.author LIKE ?)`;
//         params.push(`%${search}%`, `%${search}%`);
//     }

//     if (category) {
//         sql += ` AND p.category_id = ?`;
//         params.push(category);
//     }

//     if (minPrice) {
//         sql += ` AND p.price >= ?`;
//         params.push(minPrice);
//     }

//     if (maxPrice) {
//         sql += ` AND p.price <= ?`;
//         params.push(maxPrice);
//     }

//     return new Promise((resolve, reject) => {
//         db.get(sql, params, (err, row) => {
//             if (err) reject(err);
//             else resolve(row.count);
//         });
//     });
// };
exports.replaceImages = async (id, images) => {
    // delete old images
    await db.query(
        `DELETE FROM product_images WHERE product_id = $1`,
        [id]
    );

    // insert new images
    for (const img of images) {
        await db.query(
            `INSERT INTO product_images (product_id, image_url)
             VALUES ($1, $2)`,
            [id, img]
        );
    }
};
exports.createProduct = async (product) => {
    const { title, author, price, category_id, stock, images } = product;

    const result = await db.query(
        `INSERT INTO products (title, author, price, category_id, stock)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [title, author, price, category_id, stock]
    );

    const productId = result.rows[0].id;

    if (images?.length) {
        for (const img of images) {
            await db.query(
                `INSERT INTO product_images (product_id, image_url)
                 VALUES ($1, $2)`,
                [productId, img]
            );
        }
    }

    return { id: productId };
};
exports.getFilteredProducts = async (filters) => {
    const { search, category, minPrice, maxPrice, limit, offset } = filters;

    // 1. Base product query FIRST (no join)
    let sql = `
        SELECT p.*
        FROM products p
        WHERE 1=1
    `;

    const params = [];
    let i = 1;

    if (search) {
        sql += ` AND (p.title ILIKE $${i} OR p.author ILIKE $${i + 1})`;
        params.push(`%${search}%`, `%${search}%`);
        i += 2;
    }

    if (category) {
        sql += ` AND p.category_id = $${i}`;
        params.push(category);
        i++;
    }

    if (minPrice) {
        sql += ` AND p.price >= $${i}`;
        params.push(minPrice);
        i++;
    }

    if (maxPrice) {
        sql += ` AND p.price <= $${i}`;
        params.push(maxPrice);
        i++;
    }

    sql += ` ORDER BY p.id DESC LIMIT $${i} OFFSET $${i + 1}`;
    params.push(limit, offset);

    const productsResult = await db.query(sql, params);
    const products = productsResult.rows;

    const productIds = products.map(p => p.id);

    if (productIds.length === 0) return [];

    // 2. Fetch images separately (clean + deterministic)
    const imagesResult = await db.query(
        `
        SELECT product_id, image_url
        FROM product_images
        WHERE product_id = ANY($1)
        `,
        [productIds]
    );

    // 3. Map images
    const imageMap = {};

    for (const img of imagesResult.rows) {
        if (!imageMap[img.product_id]) {
            imageMap[img.product_id] = [];
        }
        imageMap[img.product_id].push(img.image_url);
    }

    // 4. Attach images
    return products.map(p => ({
        ...p,
        images: imageMap[p.id] || []
    }));
};
exports.getProductById = async (id) => {
    const result = await db.query(
        `SELECT p.*, pi.image_url
         FROM products p
         LEFT JOIN product_images pi ON p.id = pi.product_id
         WHERE p.id = $1`,
        [id]
    );

    if (result.rows.length === 0) return null;

    const product = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        author: result.rows[0].author,
        price: result.rows[0].price,
        category_id: result.rows[0].category_id,
        stock: result.rows[0].stock,
        images: []
    };

    result.rows.forEach(r => {
        if (r.image_url) product.images.push(r.image_url);
    });

    return product;
};
exports.getAllProducts = async () => {
    const result = await db.query(`
        SELECT
            p.id,
            p.title,
            p.price,
            p.stock,
            c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.id DESC
    `);

    return result.rows;
};
exports.getProductByIdSimple = async (id) => {
    const result = await db.query(
        `SELECT * FROM products WHERE id = $1`,
        [id]
    );
    return result.rows[0];
};
exports.restoreStock = async (product_id, quantity) => {
    await db.query(
        `UPDATE products SET stock = stock + $1 WHERE id = $2`,
        [quantity, product_id]
    );
};

exports.reduceStock = async (product_id, quantity) => {
    await db.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [quantity, product_id]
    );
};
exports.deleteProduct = async (id) => {
    const result = await db.query(
        `DELETE FROM products WHERE id = $1`,
        [id]
    );

    return { changes: result.rowCount };
};
exports.countFilteredProducts = async (filters) => {
    const { search, category, minPrice, maxPrice } = filters;

    let sql = `SELECT COUNT(DISTINCT p.id) as count FROM products p WHERE 1=1`;
    const params = [];
    let i = 1;

    if (search) {
        sql += ` AND (p.title ILIKE $${i} OR p.author ILIKE $${i + 1})`;
        params.push(`%${search}%`, `%${search}%`);
        i += 2;
    }

    if (category) {
        sql += ` AND p.category_id = $${i}`;
        params.push(category);
        i++;
    }

    if (minPrice) {
        sql += ` AND p.price >= $${i}`;
        params.push(minPrice);
        i++;
    }

    if (maxPrice) {
        sql += ` AND p.price <= $${i}`;
        params.push(maxPrice);
        i++;
    }

    const result = await db.query(sql, params);
    return result.rows[0].count;
};