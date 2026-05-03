const db = require('../config/db');

const allowedTransitions = {
    pending: ["shipped"],
    shipped: ["delivered"],
    delivered: []
};

exports.createOrder = (user_id, items, total) => {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO orders (user_id, total) VALUES (?, ?)`,
            [user_id, total],
            function (err) {
                if (err) return reject(err);

                const orderId = this.lastID;

                const stmt = db.prepare(
                    `INSERT INTO order_items (order_id, product_id, quantity, price)
                     VALUES (?, ?, ?, ?)`
                );

                items.forEach(item => {
                    stmt.run(orderId, item.product_id, item.quantity, item.price);
                });

                stmt.finalize();

                resolve({ orderId });
            }
        );
    });
};

exports.updateOrderStatus = (id, newStatus, currentStatus) => {
    return new Promise((resolve, reject) => {

        const allowedTransitions = {
            pending: ["shipped"],
            shipped: ["delivered"],
            delivered: []
        };

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
        SELECT o.*, oi.product_id, oi.quantity, oi.price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        `;

        db.all(sql, [user_id], (err, rows) => {
            if (err) return reject(err);

            const orders = {};

            rows.forEach(row => {
                if (!orders[row.id]) {
                    orders[row.id] = {
                        id: row.id,
                        user_id: row.user_id,
                        total: row.total,
                        status: row.status,
                        items: []
                    };
                }

                if (row.product_id) {
                    orders[row.id].items.push({
                        product_id: row.product_id,
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
        db.get(
            `SELECT * FROM orders WHERE id = ?`,
            [id],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
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