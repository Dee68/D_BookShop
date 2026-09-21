const db = require('../config/db');
const trx = require("../config/dbTransactions");

const allowedTransitions = {
    pending:   ["shipped", "cancelled"],
    shipped:   ["delivered", "cancelled"],
    delivered: [],              // cannot be cancelled
    cancelled: []
};
// exports.createOrder = async (user_id, items, total) => {

//     await trx.beginTransaction();

//     try {

//         const orderId = await new Promise((resolve, reject) => {
//             db.run(
//                 `
//                 INSERT INTO orders (user_id, total, status)
//                 VALUES (?, ?, 'pending')
//                 `,
//                 [user_id, total],
//                 function (err) {

//                     if (err) {
//                         return reject(err);
//                     }

//                     resolve(this.lastID);
//                 }
//             );
//         });

//         for (const item of items) {

//             await new Promise((resolve, reject) => {
//                 db.run(
//                     `
//                     INSERT INTO order_items
//                     (order_id, product_id, quantity, price)
//                     VALUES (?, ?, ?, ?)
//                     `,
//                     [
//                         orderId,
//                         item.product_id,
//                         item.quantity,
//                         item.price
//                     ],
//                     (err) => {

//                         if (err) {
//                             return reject(err);
//                         }

//                         resolve();
//                     }
//                 );
//             });

//             const stockChanges = await new Promise((resolve, reject) => {
//                 db.run(
//                     `
//                     UPDATE products
//                     SET stock = stock - ?
//                     WHERE id = ?
//                     AND stock >= ?
//                     `,
//                     [
//                         item.quantity,
//                         item.product_id,
//                         item.quantity
//                     ],
//                     function (err) {

//                         if (err) {
//                             return reject(err);
//                         }

//                         resolve(this.changes);
//                     }
//                 );
//             });

//             if (stockChanges === 0) {
//                 throw new Error(
//                     `Insufficient stock for product ${item.product_id}`
//                 );
//             }
//         }

//         await trx.commit();

//         return { orderId };

//     } catch (error) {

//         await trx.rollback();
//         throw error;
//     }
// };

// exports.updateOrderStatus = (id, newStatus, currentStatus) => {

//     if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
//         throw new Error("Invalid status transition");
//     }

//     return new Promise((resolve, reject) => {

//         db.run(
//             `
//             UPDATE orders
//             SET status = ?
//             WHERE id = ?
//             `,
//             [newStatus, id],
//             function (err) {

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve({
//                     changes: this.changes
//                 });
//             }
//         );

//     });
// };

// exports.getOrderItems = (order_id) => {

//     return new Promise((resolve, reject) => {

//         db.all(
//             `
//             SELECT product_id, quantity
//             FROM order_items
//             WHERE order_id = ?
//             `,
//             [order_id],
//             (err, rows) => {

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve(rows);
//             }
//         );

//     });
// };


// exports.cancelOrderWithRestore = async (orderId) => {
//     await trx.beginTransaction();
//     try {
//         // 1. Atomically claim the cancellation
//         const changes = await new Promise((resolve, reject) => {
//             db.run(
//                 `UPDATE orders
//                  SET status = 'cancelled'
//                  WHERE id = ?
//                    AND status IN ('pending', 'shipped')`,
//                 [orderId],
//                 function (err) {
//                     if (err) return reject(err);
//                     resolve(this.changes);
//                 }
//             );
//         });

//         if (changes === 0) {
//             await trx.rollback();
//             return { changes: 0 };   // already cancelled, delivered, or not found
//         }

//         // 2. Only now restore stock — we know we won the race
//         await new Promise((resolve, reject) => {
//             db.run(
//                 `UPDATE products
//                  SET stock = stock + (
//                      SELECT COALESCE(SUM(oi.quantity), 0)
//                      FROM order_items oi
//                      WHERE oi.product_id = products.id
//                        AND oi.order_id = ?
//                  )
//                  WHERE id IN (
//                      SELECT product_id FROM order_items WHERE order_id = ?
//                  )`,
//                 [orderId, orderId],
//                 (err) => err ? reject(err) : resolve()
//             );
//         });

//         await trx.commit();
//         return { changes };

//     } catch (error) {
//         await trx.rollback();
//         throw error;
//     }
// };

// exports.getOrdersByUser = (user_id) => {

//     return new Promise((resolve, reject) => {

//         db.all(
//             `
//             SELECT 
//                 o.id,
//                 o.total,
//                 o.status,
//                 o.created_at,
//                 oi.product_id,
//                 oi.quantity,
//                 oi.price,
//                 p.title
//             FROM orders o
//             LEFT JOIN order_items oi ON o.id = oi.order_id
//             LEFT JOIN products p ON oi.product_id = p.id
//             WHERE o.user_id = ?
//             ORDER BY o.id DESC
//             `,
//             [user_id],
//             (err, rows) => {

//                 if (err) {
//                     return reject(err);
//                 }

//                 const orders = {};

//                 rows.forEach(row => {

//                     if (!orders[row.id]) {
//                         orders[row.id] = {
//                             id: row.id,
//                             total: row.total,
//                             status: row.status,
//                             created_at: row.created_at,
//                             items: []
//                         };
//                     }

//                     if (row.product_id) {
//                         orders[row.id].items.push({
//                             product_id: row.product_id,
//                             title: row.title,
//                             quantity: row.quantity,
//                             price: row.price
//                         });
//                     }
//                 });

//                 resolve(Object.values(orders));
//             }
//         );

//     });
// };

// exports.getOrderById = async (id) => {

//     const rows = await new Promise((resolve, reject) => {

//         db.all(
//             `
//             SELECT 
//                 o.id AS order_id,
//                 o.user_id,
//                 o.total,
//                 o.status,
//                 o.created_at,
//                 u.name AS user_name,
//                 u.email,
//                 oi.product_id,
//                 oi.quantity,
//                 oi.price,
//                 p.title
//             FROM orders o
//             JOIN users u ON o.user_id = u.id
//             LEFT JOIN order_items oi ON o.id = oi.order_id
//             LEFT JOIN products p ON oi.product_id = p.id
//             WHERE o.id = ?
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

//     if (!rows.length) {
//         return null;
//     }

//     const order = {
//         id: rows[0].order_id,
//         user_id: rows[0].user_id,
//         total: rows[0].total,
//         status: rows[0].status,
//         created_at: rows[0].created_at,
//         user: {
//             name: rows[0].user_name,
//             email: rows[0].email
//         },
//         itemsMap: {}
//     };

//     rows.forEach(row => {

//         if (!row.product_id) {
//             return;
//         }

//         if (!order.itemsMap[row.product_id]) {
//             order.itemsMap[row.product_id] = {
//                 product_id: row.product_id,
//                 title: row.title,
//                 quantity: row.quantity,
//                 price: row.price,
//                 image: null
//             };
//         }
//     });

//     const productIds = Object.keys(order.itemsMap).map(Number);

//     if (productIds.length === 0) {
//         order.items = [];
//         delete order.itemsMap;
//         return order;
//     }

//     const imageRows = await new Promise((resolve, reject) => {

//         db.all(
//             `
//             SELECT
//                 pi.product_id,
//                 pi.image_url
//             FROM product_images pi
//             INNER JOIN order_items oi
//                 ON pi.product_id = oi.product_id
//             WHERE oi.order_id = ?
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

//     imageRows.forEach(img => {

//         if (order.itemsMap[img.product_id]) {
//             order.itemsMap[img.product_id].image = img.image_url;
//         }

//     });

//     order.items = Object.values(order.itemsMap);

//     delete order.itemsMap;

//     return order;
// };

// exports.getOrderStatus = (id) => {
//     return new Promise((resolve, reject) => {
//         db.get(
//             `SELECT status FROM orders WHERE id = ?`,
//             [id],
//             (err, row) => {
//                 if (err) return reject(err);
//                 resolve(row ? row.status : null);
//             }
//         );
//     });
// };

// exports.getAllOrders = (page = 1, limit = 5, status = null, user = null) => {

//     const offset = (page - 1) * limit;

//     return new Promise((resolve, reject) => {

//         // Build the filtering conditions
//         let where = `WHERE 1=1`;
//         const filterParams = [];

//         if (status) {
//             where += ` AND o.status = ?`;
//             filterParams.push(status);
//         }

//         if (user) {
//             where += ` AND o.user_id = ?`;
//             filterParams.push(user);
//         }

//         // First count the matching orders
//         db.get(
//             `
//             SELECT COUNT(*) AS count
//             FROM orders o
//             ${where}
//             `,
//             filterParams,
//             (err, countRow) => {

//                 if (err) {
//                     return reject(err);
//                 }

//                 const total = countRow.count;

//                 /*
//                  * Select only the orders for the requested page.
//                  * Pagination is applied before joining order_items,
//                  * so one order with multiple items still counts as
//                  * one order.
//                  */
//                 db.all(
//                     `
//                     SELECT
//                         o.id,
//                         o.user_id,
//                         o.total,
//                         o.status,
//                         o.created_at,
//                         u.name AS user_name,
//                         u.email
//                     FROM orders o
//                     JOIN users u
//                         ON o.user_id = u.id
//                     ${where}
//                     ORDER BY o.id DESC
//                     LIMIT ? OFFSET ?
//                     `,
//                     [...filterParams, limit, offset],
//                     (err, orderRows) => {

//                         if (err) {
//                             return reject(err);
//                         }

//                         if (orderRows.length === 0) {
//                             return resolve({
//                                 data: [],
//                                 total,
//                                 page,
//                                 limit,
//                                 totalPages: Math.ceil(total / limit)
//                             });
//                         }

//                         const orderIds = orderRows.map(order => order.id);

//                         const placeholders = orderIds
//                             .map(() => '?')
//                             .join(',');

//                         /*
//                          * Now retrieve the items belonging only to
//                          * the orders on this page.
//                          */
//                         db.all(
//                             `
//                             SELECT
//                                 oi.order_id,
//                                 oi.product_id,
//                                 oi.quantity,
//                                 oi.price,
//                                 p.title
//                             FROM order_items oi
//                             LEFT JOIN products p
//                                 ON oi.product_id = p.id
//                             WHERE oi.order_id IN (${placeholders})
//                             ORDER BY oi.id ASC
//                             `,
//                             orderIds,
//                             (err, itemRows) => {

//                                 if (err) {
//                                     return reject(err);
//                                 }

//                                 const orders = {};

//                                 // Build the order objects
//                                 orderRows.forEach(row => {

//                                     orders[row.id] = {
//                                         id: row.id,
//                                         user_id: row.user_id,
//                                         total: row.total,
//                                         status: row.status,
//                                         created_at: row.created_at,

//                                         user: {
//                                             name: row.user_name,
//                                             email: row.email
//                                         },

//                                         items: []
//                                     };
//                                 });

//                                 // Add items to their corresponding orders
//                                 itemRows.forEach(row => {

//                                     if (orders[row.order_id]) {

//                                         orders[row.order_id].items.push({
//                                             product_id: row.product_id,
//                                             title: row.title,
//                                             quantity: row.quantity,
//                                             price: row.price
//                                         });

//                                     }
//                                 });

//                                 resolve({
//                                     data: orderRows.map(row => orders[row.id]),
//                                     total,
//                                     page,
//                                     limit,
//                                     totalPages: Math.ceil(total / limit)
//                                 });

//                             }
//                         );

//                     }
//                 );

//             }
//         );

//     });
// };

//== PostgreSql ==

exports.createOrder = async (user_id, items, total) => {

    const client = await trx.beginTransaction();

    try {

        const orderResult = await client.query(
            `
            INSERT INTO orders (user_id, total, status)
            VALUES ($1, $2, 'pending')
            RETURNING id
            `,
            [user_id, total]
        );

        const orderId = orderResult.rows[0].id;

        for (const item of items) {

            await client.query(
                `
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)
                `,
                [orderId, item.product_id, item.quantity, item.price]
            );

            const stockResult = await client.query(
                `
                UPDATE products
                SET stock = stock - $1
                WHERE id = $2
                AND stock >= $3
                `,
                [item.quantity, item.product_id, item.quantity]
            );

            if (stockResult.rowCount === 0) {
                throw new Error(`Insufficient stock for product ${item.product_id}`);
            }
        }

        await trx.commit(client);

        return { orderId };

    } catch (err) {
        await trx.rollback(client);
        throw err;
    }
};

exports.updateOrderStatus = async (id, newStatus, currentStatus) => {

    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
        throw new Error("Invalid status transition");
    }

    const result = await db.query(
        `
        UPDATE orders
        SET status = $1
        WHERE id = $2
        `,
        [newStatus, id]
    );

    return { changes: result.rowCount };
};

exports.getOrderItems = async (order_id) => {

    const result = await db.query(
        `
        SELECT product_id, quantity
        FROM order_items
        WHERE order_id = $1
        `,
        [order_id]
    );

    return result.rows;
};

exports.cancelOrderWithRestore = async (orderId) => {
    const client = await trx.beginTransaction();

    try {
        const claim = await client.query(
            `UPDATE orders
             SET status = 'cancelled'
             WHERE id = $1
               AND status IN ('pending', 'shipped')`,
            [orderId]
        );

        if (claim.rowCount === 0) {
            await trx.rollback(client);
            return { changes: 0 };
        }

        await client.query(
            `UPDATE products
             SET stock = stock + (
                 SELECT COALESCE(SUM(oi.quantity), 0)
                 FROM order_items oi
                 WHERE oi.product_id = products.id
                   AND oi.order_id = $1
             )
             WHERE id IN (
                 SELECT product_id FROM order_items WHERE order_id = $1
             )`,
            [orderId]
        );

        await trx.commit(client);
        return { changes: claim.rowCount };

    } catch (error) {
        await trx.rollback(client);
        throw error;
    }
};

exports.getOrdersByUser = async (user_id) => {

    const result = await db.query(
        `
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
        WHERE o.user_id = $1
        ORDER BY o.id DESC
        `,
        [user_id]
    );

    const orders = {};

    result.rows.forEach(row => {

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

    return Object.values(orders);
};

exports.getOrderById = async (id) => {

    const result = await db.query(
        `
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
        WHERE o.id = $1
        `,
        [id]
    );

    if (!result.rows.length) return null;

    const order = {
        id: result.rows[0].order_id,
        user_id: result.rows[0].user_id,
        total: result.rows[0].total,
        status: result.rows[0].status,
        created_at: result.rows[0].created_at,
        user: {
            name: result.rows[0].user_name,
            email: result.rows[0].email
        },
        itemsMap: {}
    };

    result.rows.forEach(row => {

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

    const productIds = Object.keys(order.itemsMap).map(Number);

    if (productIds.length === 0) {
        order.items = [];
        delete order.itemsMap;
        return order;
    }

    const imageResult = await db.query(
        `
        SELECT product_id, image_url
        FROM product_images
        WHERE product_id = ANY($1)
        `,
        [productIds]
    );

    imageResult.rows.forEach(img => {
        if (order.itemsMap[img.product_id]) {
            order.itemsMap[img.product_id].image = img.image_url;
        }
    });

    order.items = Object.values(order.itemsMap);
    delete order.itemsMap;

    return order;
};

exports.getOrderStatus = async (id) => {
    const result = await db.query(
        `SELECT status FROM orders WHERE id = $1`,
        [id]
    );
    return result.rows.length ? result.rows[0].status : null;
};

exports.getAllOrders = async (page = 1, limit = 5, status = null, user = null) => {
    const offset = (page - 1) * limit;

    let where = `WHERE 1=1`;
    const filterParams = [];
    let i = 1;

    if (status) {
        where += ` AND o.status = $${i}`;
        filterParams.push(status);
        i++;
    }

    if (user) {
        where += ` AND o.user_id = $${i}`;
        filterParams.push(user);
        i++;
    }

    const countResult = await db.query(
        `SELECT COUNT(*) AS count FROM orders o ${where}`,
        filterParams
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const ordersResult = await db.query(
        `SELECT
            o.id,
            o.user_id,
            o.total,
            o.status,
            o.created_at,
            u.name AS user_name,
            u.email
         FROM orders o
         JOIN users u ON o.user_id = u.id
         ${where}
         ORDER BY o.id DESC
         LIMIT $${i} OFFSET $${i + 1}`,
        [...filterParams, limit, offset]
    );

    const orderRows = ordersResult.rows;

    if (orderRows.length === 0) {
        return {
            data: [],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    const orderIds = orderRows.map(o => o.id);

    const itemsResult = await db.query(
        `SELECT
            oi.order_id,
            oi.product_id,
            oi.quantity,
            oi.price,
            p.title
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ANY($1)
         ORDER BY oi.id ASC`,
        [orderIds]
    );

    const orders = {};
    orderRows.forEach(row => {
        orders[row.id] = {
            id: row.id,
            user_id: row.user_id,
            total: row.total,
            status: row.status,
            created_at: row.created_at,
            user: { name: row.user_name, email: row.email },
            items: []
        };
    });

    itemsResult.rows.forEach(row => {
        if (orders[row.order_id]) {
            orders[row.order_id].items.push({
                product_id: row.product_id,
                title: row.title,
                quantity: row.quantity,
                price: row.price
            });
        }
    });

    return {
        data: orderRows.map(row => orders[row.id]),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
    };
};
