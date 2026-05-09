const db = require('../config/db');

const allowedTransitions = {
    pending: ["shipped"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: []
};

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

exports.createOrder = async (user_id, items, total) => {

    try {

        await runQuery("BEGIN TRANSACTION");

        const orderResult = await runQuery(
            `INSERT INTO orders (user_id, total, status)
             VALUES (?, ?, 'pending')`,
            [user_id, total]
        );

        const orderId = orderResult.lastID;

        for (const item of items) {

            await runQuery(
                `INSERT INTO order_items
                 (order_id, product_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.product_id,
                    item.quantity,
                    item.price
                ]
            );

            const stockResult = await runQuery(
                `UPDATE products
                 SET stock = stock - ?
                 WHERE id = ?
                 AND stock >= ?`,
                [
                    item.quantity,
                    item.product_id,
                    item.quantity
                ]
            );

            if (stockResult.changes === 0) {
                throw new Error(
                    `Insufficient stock for product ${item.product_id}`
                );
            }
        }

        await runQuery("COMMIT");

        return { orderId };

    } catch (error) {

        await runQuery("ROLLBACK");

        throw error;
    }
};
exports.updateOrderStatus = (id, newStatus, currentStatus) => {
    return new Promise((resolve, reject) => {

        // const allowedTransitions = {
        //     pending: ["shipped"],
        //     shipped: ["delivered"],
        //     delivered: []
        // };

        if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
            return reject(new Error("Invalid status transition"));
        }

        db.run(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [newStatus, id],
            function (err) {
                if (err) return reject(err);
                resolve({ changes: this.changes });
            }
        );
    });
};

exports.getOrderItems = (order_id) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
            [order_id],
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};

exports.cancelOrder = (order_id) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE orders SET status = 'cancelled' WHERE id = ?`,
            [order_id],
            function (err) {
                if (err) return reject(err);
                resolve({ changes: this.changes });
            }
        );
    });
};

exports.getOrdersByUser = (user_id) => {
    return new Promise((resolve, reject) => {

        const sql = `
        SELECT 
            o.id,
            o.total,
            o.status,
            o.created_at,
            oi.product_id,
            oi.quantity,
            oi.price,
            p.title
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.id DESC
        `;

        db.all(sql, [user_id], (err, rows) => {
            if (err) return reject(err);

            const orders = {};

            rows.forEach(row => {

                if (!orders[row.id]) {
                    orders[row.id] = {
                        id: row.id,
                        total: row.total,
                        status: row.status,
                        created_at: row.created_at, 
                        items: []
                    };
                }

                if (row.product_id) {
                    orders[row.id].items.push({
                        product_id: row.product_id,
                        title: row.title,        
                        quantity: row.quantity,
                        price: row.price
                    });
                }
            });

            resolve(Object.values(orders));
        });
    });
};

exports.getOrderById = (id) => {
    return new Promise((resolve, reject) => {

        const sql = `
        SELECT 
            o.id as order_id,
            o.user_id,
            o.total,
            o.status,
            o.created_at,
            u.name as user_name,
            u.email,
            oi.product_id,
            oi.quantity,
            oi.price,
            p.title
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.id = ?
        `;

        db.all(sql, [id], (err, rows) => {
            if (err) return reject(err);
            if (!rows.length) return resolve(null);

            // Base order object
            const order = {
                id: rows[0].order_id,
                user_id: rows[0].user_id,
                total: rows[0].total,
                status: rows[0].status,
                created_at: rows[0].created_at,
                user: {
                    name: rows[0].user_name,
                    email: rows[0].email
                },
                itemsMap: {}
            };

            // Build items (NO images yet)
            rows.forEach(row => {
                if (!row.product_id) return;

                if (!order.itemsMap[row.product_id]) {
                    order.itemsMap[row.product_id] = {
                        product_id: row.product_id,
                        title: row.title,
                        quantity: row.quantity,
                        price: row.price,
                        image: null
                    };
                }
            });

            // Now fetch images separately (CLEAN SOLUTION)
            const productIds = Object.keys(order.itemsMap);

            if (productIds.length === 0) {
                order.items = [];
                delete order.itemsMap;
                return resolve(order);
            }

            const placeholders = productIds.map(() => '?').join(',');

            db.all(
                `SELECT product_id, image_url 
                 FROM product_images 
                 WHERE product_id IN (${placeholders})`,
                productIds,
                (imgErr, images) => {
                    if (imgErr) return reject(imgErr);

                    // attach ONLY first image per product
                    images.forEach(img => {
                        if (
                            order.itemsMap[img.product_id] &&
                            !order.itemsMap[img.product_id].image
                        ) {
                            order.itemsMap[img.product_id].image = img.image_url;
                        }
                    });

                    // convert to array for frontend
                    order.items = Object.values(order.itemsMap);
                    delete order.itemsMap;

                    resolve(order);
                }
            );
        });
    });
};
exports.getAllOrders = () => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT 
            o.id as order_id,
            o.total,
            o.status,
            o.created_at,
            u.name as user_name,
            u.email,
            oi.product_id,
            oi.quantity,
            oi.price,
            p.title
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        ORDER BY o.id DESC
        `;

        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);

            const orders = {};

            rows.forEach(row => {
                if (!orders[row.order_id]) {
                    orders[row.order_id] = {
                        id: row.order_id,
                        total: row.total,
                        status: row.status,
                        created_at: row.created_at,
                        user: {
                            name: row.user_name,
                            email: row.email
                        },
                        items: []
                    };
                }

                if (row.product_id) {
                    orders[row.order_id].items.push({
                        product_id: row.product_id,
                        title: row.title,
                        quantity: row.quantity,
                        price: row.price
                    });
                }
            });

            resolve(Object.values(orders));
        });
    });
};

exports.restoreOrderStock = (orderId) => {
    return new Promise((resolve, reject) => {

        db.all(
            `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
            [orderId],
            (err, items) => {
                if (err) return reject(err);

                const stmt = db.prepare(
                    `UPDATE products SET stock = stock + ? WHERE id = ?`
                );

                items.forEach(item => {
                    stmt.run(item.quantity, item.product_id);
                });

                stmt.finalize(err => {
                    if (err) reject(err);
                    else resolve();
                });
            }
        );
    });
};