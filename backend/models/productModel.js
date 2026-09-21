// const db = require('../config/db');
 
// exports.replaceImages = async (id, images) => {
//     await new Promise((resolve, reject) => {
//         db.run(
//             `DELETE FROM product_images WHERE product_id = ?`,
//             [id],
//             (err) => {
//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve();
//             }
//         );
//     });

//     for (const img of images) {
//         await new Promise((resolve, reject) => {
//             db.run(
//                 `
//                 INSERT INTO product_images (
//                     product_id,
//                     image_url
//                 )
//                 VALUES (?, ?)
//                 `,
//                 [id, img],
//                 (err) => {
//                     if (err) {
//                         return reject(err);
//                     }

//                     resolve();
//                 }
//             );
//         });
//     }
// };

// exports.createProduct = async (product) => {
//     const {
//         title,
//         author,
//         price,
//         category_id,
//         stock,
//         images
//     } = product;

//     const productId = await new Promise((resolve, reject) => {
//         db.run(
//             `
//             INSERT INTO products (
//                 title,
//                 author,
//                 price,
//                 category_id,
//                 stock
//             )
//             VALUES (?, ?, ?, ?, ?)
//             `,
//             [
//                 title,
//                 author,
//                 price,
//                 category_id,
//                 stock
//             ],
//             function (err) {

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve(this.lastID);
//             }
//         );
//     });

//     if (images?.length) {
//         for (const img of images) {
//             await new Promise((resolve, reject) => {
//                 db.run(
//                     `
//                     INSERT INTO product_images (
//                         product_id,
//                         image_url
//                     )
//                     VALUES (?, ?)
//                     `,
//                     [productId, img],
//                     (err) => {

//                         if (err) {
//                             return reject(err);
//                         }

//                         resolve();
//                     }
//                 );
//             });
//         }
//     }

//     return {
//         id: productId
//     };
// };

// exports.getProductById = async (id) => {

//     const product = await new Promise((resolve, reject) => {

//         db.get(
//             `
//             SELECT *
//             FROM products
//             WHERE id = ?
//             `,
//             [id],
//             (err, row) => {

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve(row);
//             }
//         );

//     });

//     if (!product) {
//         return null;
//     }

//     const images = await new Promise((resolve, reject) => {

//         db.all(
//             `
//             SELECT image_url
//             FROM product_images
//             WHERE product_id = ?
//             `,
//             [id],
//             (err, rows) => {

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve(rows);
//             }
//         );

//     });

//     return {
//         ...product,
//         images: images.map(row => row.image_url)
//     };
// };
 
// exports.getFilteredProducts = (filters) => {
//     const {
//         search,
//         category,
//         minPrice,
//         maxPrice,
//         limit,
//         offset
//     } = filters;

//     let sql = `
//         SELECT
//             p.id,
//             p.title,
//             p.author,
//             p.price,
//             p.category_id,
//             p.stock,
//             pi.image_url
//         FROM (
//             SELECT *
//             FROM products
//             WHERE 1=1
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

//     if (minPrice !== null && minPrice !== undefined) {
//         sql += ` AND price >= ?`;
//         params.push(minPrice);
//     }

//     if (maxPrice !== null && maxPrice !== undefined) {
//         sql += ` AND price <= ?`;
//         params.push(maxPrice);
//     }

//     sql += `
//             ORDER BY id DESC
//             LIMIT ? OFFSET ?
//         ) p
//         LEFT JOIN product_images pi
//             ON p.id = pi.product_id
//     `;

//     params.push(limit, offset);

//     return new Promise((resolve, reject) => {

//         db.all(sql, params, (err, rows) => {

//             if (err) {
//                 return reject(err);
//             }

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


// exports.getAllProducts = () => {

//     return new Promise((resolve, reject) => {

//         db.all(
//             `
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
//             `,
//             [],
//             (err, rows) => {

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve(rows);
//             }
//         );

//     });
// };

// exports.countFilteredProducts = (filters) => {

//     const {
//         search,
//         category,
//         minPrice,
//         maxPrice
//     } = filters;

//     let sql = `
//         SELECT COUNT(DISTINCT p.id) AS count
//         FROM products p
//         WHERE 1=1
//     `;

//     const params = [];

//     if (search) {
//         sql += ` AND (p.title LIKE ? OR p.author LIKE ?)`;
//         params.push(`%${search}%`, `%${search}%`);
//     }

//     if (category) {
//         sql += ` AND p.category_id = ?`;
//         params.push(category);
//     }

//     if (minPrice !== null && minPrice !== undefined) {
//         sql += ` AND p.price >= ?`;
//         params.push(minPrice);
//     }

//     if (maxPrice !== null && maxPrice !== undefined) {
//         sql += ` AND p.price <= ?`;
//         params.push(maxPrice);
//     }

//     return new Promise((resolve, reject) => {

//         db.get(
//             sql,
//             params,
//             (err, row) => {

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve(row.count);
//             }
//         );

//     });
// };

// exports.updateProduct = async (id, data, images = []) => {

//     const allowedFields = [
//         'title',
//         'author',
//         'price',
//         'category_id',
//         'stock'
//     ];

//     const fields = [];
//     const values = [];

//     for (const field of allowedFields) {
//         if (data[field] !== undefined) {
//             fields.push(`${field} = ?`);
//             values.push(data[field]);
//         }
//     }

//     // Update product fields only if fields were supplied
//     if (fields.length > 0) {

//         values.push(id);

//         await new Promise((resolve, reject) => {

//             db.run(
//                 `
//                 UPDATE products
//                 SET ${fields.join(', ')}
//                 WHERE id = ?
//                 `,
//                 values,
//                 function (err) {

//                     if (err) {
//                         return reject(err);
//                     }

//                     resolve();
//                 }
//             );

//         });
//     }

//     // Replace images only when new images were uploaded
//     if (images.length > 0) {
//         await exports.replaceImages(id, images);
//     }

//     // Return the updated product
//     return await exports.getProductById(id);
// };

// exports.restoreStock = (product_id, quantity) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             `
//             UPDATE products
//             SET stock = stock + ?
//             WHERE id = ?
//             `,
//             [quantity, product_id],
//             function (err) {
//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve();
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


//== PostgrSql ==
const db = require('../config/db');
exports.replaceImages = async (id, images) => {
    const client = await db.connect();
    try {
        await client.query('BEGIN');
        await client.query(`DELETE FROM product_images WHERE product_id = $1`, [id]);
        for (const img of images) {
            await client.query(
                `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
                [id, img]
            );
        }
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

exports.createProduct = async (product) => {
    const { title, author, price, category_id, stock, images } = product;
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO products (title, author, price, category_id, stock)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [title, author, price, category_id, stock]
        );
        const productId = result.rows[0].id;

        if (images?.length) {
            for (const img of images) {
                await client.query(
                    `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
                    [productId, img]
                );
            }
        }

        await client.query('COMMIT');
        return { id: productId };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

exports.getProductById = async (id) => {
    const productRes = await db.query(
        `SELECT * FROM products WHERE id = $1`,
        [id]
    );
    if (productRes.rows.length === 0) return null;

    const imagesRes = await db.query(
        `SELECT image_url FROM product_images WHERE product_id = $1`,
        [id]
    );

    return {
        ...productRes.rows[0],
        images: imagesRes.rows.map(r => r.image_url)
    };
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

exports.countFilteredProducts = async (filters) => {
    const { search, category, minPrice, maxPrice } = filters;
    let sql = `SELECT COUNT(DISTINCT p.id) AS count FROM products p WHERE 1=1`;
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
    if (minPrice !== null && minPrice !== undefined && minPrice !== '') {
        sql += ` AND p.price >= $${i}`;
        params.push(minPrice);
        i++;
    }
    if (maxPrice !== null && maxPrice !== undefined && maxPrice !== '') {
        sql += ` AND p.price <= $${i}`;
        params.push(maxPrice);
        i++;
    }

    const result = await db.query(sql, params);
    return parseInt(result.rows[0].count, 10);
};

exports.updateProduct = async (id, data, images = []) => {
    const allowedFields = ['title', 'author', 'price', 'category_id', 'stock'];
    const fields = [];
    const values = [];
    let i = 1;

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(`${field} = $${i}`);
            values.push(data[field]);
            i++;
        }
    }

    if (fields.length > 0) {
        values.push(id);
        await db.query(
            `UPDATE products SET ${fields.join(', ')} WHERE id = $${i}`,
            values
        );
    }

    if (images.length > 0) {
        await exports.replaceImages(id, images);
    }

    return await exports.getProductById(id);
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



