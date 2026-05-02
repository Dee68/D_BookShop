const db = require('../config/db');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { getPagination } = require('../utils/pagination');

exports.getStats = async (req, res) => {
    try {
        const stats = {};

        // total users
        stats.users = await new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) as count FROM users`, [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        // total products
        stats.products = await new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) as count FROM products`, [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        // total orders
        stats.orders = await new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) as count FROM orders`, [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        // total revenue
        stats.revenue = await new Promise((resolve, reject) => {
            db.get(`SELECT SUM(total) as total FROM orders`, [], (err, row) => {
                if (err) reject(err);
                else resolve(row.total || 0);
            });
        });

        res.json(stats);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { page, limit, offset } = getPagination(req);

        let sql = `
        SELECT o.*, u.name as user_name, u.email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE 1=1
        `;

        const params = [];

        if (req.query.status) {
            sql += ` AND o.status = ?`;
            params.push(req.query.status);
        }

        if (req.query.user) {
            sql += ` AND o.user_id = ?`;
            params.push(req.query.user);
        }

        sql += ` ORDER BY o.id DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        db.all(sql, params, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                data: rows,
                pagination: {
                    page,
                    limit
                }
            });
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { page, limit, offset } = getPagination(req);

        const total = await new Promise((resolve, reject) => {
            db.get(`SELECT COUNT(*) as count FROM users`, [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });

        db.all(
            `SELECT id, name, email, role
             FROM users
             LIMIT ? OFFSET ?`,
            [limit, offset],
            (err, rows) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({
                    data: rows,
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit)
                    }
                });
            }
        );

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await Order.updateOrderStatus(id, status);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({ message: "Order status updated" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // get items
        const items = await Order.getOrderItems(id);

        if (!items.length) {
            return res.status(404).json({ error: "Order not found" });
        }

        // restore stock
        for (const item of items) {
            await Product.restoreStock(item.product_id, item.quantity);
        }

        // update status
        await Order.updateOrderStatus(id, 'cancelled');

        res.json({ message: "Order cancelled and stock restored" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.promoteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await User.updateUserRole(id, 'admin');

        if (result.changes === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User promoted to admin" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};