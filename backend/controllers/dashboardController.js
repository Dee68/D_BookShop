const db = require('../config/db');
// exports.getSalesStats = async (req, res) => {
//     try {
//         db.get(`
//             SELECT 
//                 COUNT(*) as totalOrders,
//                 SUM(total) as totalRevenue
//             FROM orders
//         `, [], (err, row) => {
//             if (err) return res.status(500).json({ error: err.message });

//             res.json({
//                 totalOrders: row.totalOrders,
//                 totalRevenue: row.totalRevenue || 0
//             });
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.getOrderStatusStats = (req, res) => {
//     db.all(`
//         SELECT status, COUNT(*) as count
//         FROM orders
//         GROUP BY status
//     `, [], (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });

//         res.json(rows);
//     });
// };

// exports.getSystemStats = (req, res) => {
//     db.serialize(() => {
//         db.get(`SELECT COUNT(*) as totalUsers FROM users`, [], (err, users) => {
//             db.get(`SELECT COUNT(*) as totalProducts FROM products`, [], (err2, products) => {
//                 db.get(`SELECT COUNT(*) as lowStock FROM products WHERE stock < 5`, [], (err3, lowStock) => {
//                     res.json({
//                         totalUsers: users.totalUsers,
//                         totalProducts: products.totalProducts,
//                         lowStock: lowStock.lowStock
//                     });
//                 });
//             });
//         });
//     });
// };

exports.getSalesStats = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                COUNT(*) AS "totalOrders",
                COALESCE(SUM(total), 0) AS "totalRevenue"
            FROM orders
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

        res.json(result.rows);

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
            totalUsers: Number(usersRes.rows[0].totalusers || usersRes.rows[0].totalUsers),
            totalProducts: Number(productsRes.rows[0].totalproducts || productsRes.rows[0].totalProducts),
            lowStock: Number(lowStockRes.rows[0].lowstock || lowStockRes.rows[0].lowStock)
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

