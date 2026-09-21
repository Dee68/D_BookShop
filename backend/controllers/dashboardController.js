// const db = require('../config/db');

// exports.getSalesStats = (req, res) => {
//     db.get(
//         `
//         SELECT
//             COUNT(*) AS totalOrders,
//             COALESCE(SUM(total), 0) AS totalRevenue
//         FROM orders
//         WHERE status <> 'cancelled'
//         `,
//         [],
//         (err, row) => {
//             if (err) {
//                 return res.status(500).json({
//                     error: err.message
//                 });
//             }

//             res.json({
//                 totalOrders: Number(row.totalOrders),
//                 totalRevenue: Number(row.totalRevenue)
//             });
//         }
//     );
// };

// exports.getOrderStatusStats = (req, res) => {
//     db.all(
//         `
//         SELECT
//             status,
//             COUNT(*) AS count
//         FROM orders
//         GROUP BY status
//         `,
//         [],
//         (err, rows) => {
//             if (err) {
//                 return res.status(500).json({
//                     error: err.message
//                 });
//             }

//             res.json(rows);
//         }
//     );
// };

// exports.getSystemStats = (req, res) => {
//     db.serialize(() => {

//         db.get(
//             `SELECT COUNT(*) AS totalUsers FROM users`,
//             [],
//             (err, users) => {

//                 if (err) {
//                     return res.status(500).json({
//                         error: err.message
//                     });
//                 }

//                 db.get(
//                     `SELECT COUNT(*) AS totalProducts FROM products`,
//                     [],
//                     (err, products) => {

//                         if (err) {
//                             return res.status(500).json({
//                                 error: err.message
//                             });
//                         }

//                         db.get(
//                             `
//                             SELECT COUNT(*) AS lowStock
//                             FROM products
//                             WHERE stock < 5
//                             `,
//                             [],
//                             (err, lowStock) => {

//                                 if (err) {
//                                     return res.status(500).json({
//                                         error: err.message
//                                     });
//                                 }

//                                 res.json({
//                                     totalUsers: Number(users.totalUsers),
//                                     totalProducts: Number(products.totalProducts),
//                                     lowStock: Number(lowStock.lowStock)
//                                 });
//                             }
//                         );
//                     }
//                 );
//             }
//         );
//     });
// };

//=== PostgreSql ==
const db = require('../config/db');
exports.getSalesStats = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                COUNT(*) AS "totalOrders",
                COALESCE(SUM(total), 0) AS "totalRevenue"
            FROM orders WHERE status <> 'cancelled'
        `);

        const row = result.rows[0];

        res.json({
            totalOrders: Number(row.totalOrders),
            totalRevenue: Number(row.totalRevenue)
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderStatusStats = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT status, COUNT(*) AS count
            FROM orders
            GROUP BY status
        `);

        res.json(result.rows.map(r => ({
            status: r.status,
            count: Number(r.count)
        })));

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSystemStats = async (req, res) => {
    try {
        const [usersRes, productsRes, lowStockRes] = await Promise.all([
            db.query(`SELECT COUNT(*) AS totalUsers FROM users`),
            db.query(`SELECT COUNT(*) AS totalProducts FROM products`),
            db.query(`SELECT COUNT(*) AS lowStock FROM products WHERE stock < 5`)
        ]);

        res.json({
            totalUsers: Number(usersRes.rows[0].totalUsers),
            totalProducts: Number(productsRes.rows[0].totalProducts),
            lowStock: Number(lowStockRes.rows[0].lowStock)
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

