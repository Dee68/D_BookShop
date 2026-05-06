const db = require('../config/db');
exports.getSalesStats = async (req, res) => {
    try {
        db.get(`
            SELECT 
                COUNT(*) as totalOrders,
                SUM(total) as totalRevenue
            FROM orders
        `, [], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                totalOrders: row.totalOrders,
                totalRevenue: row.totalRevenue || 0
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderStatusStats = (req, res) => {
    db.all(`
        SELECT status, COUNT(*) as count
        FROM orders
        GROUP BY status
    `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(rows);
    });
};

exports.getSystemStats = (req, res) => {
    db.serialize(() => {
        db.get(`SELECT COUNT(*) as totalUsers FROM users`, [], (err, users) => {
            db.get(`SELECT COUNT(*) as totalProducts FROM products`, [], (err2, products) => {
                db.get(`SELECT COUNT(*) as lowStock FROM products WHERE stock < 5`, [], (err3, lowStock) => {
                    res.json({
                        totalUsers: users.totalUsers,
                        totalProducts: products.totalProducts,
                        lowStock: lowStock.lowStock
                    });
                });
            });
        });
    });
};