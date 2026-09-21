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

        const { page, limit } = getPagination(req);

        const status = req.query.status || null;
        const user = req.query.user || null;

        const result = await Order.getAllOrders(
            page,
            limit,
            status,
            user
        );

        res.json(result);

    } catch (error) {

        console.error("GET ALL ORDERS ERROR:", error);

        res.status(500).json({
            error: error.message
        });
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

        // Fetch the current status from the DB — do NOT trust the caller
        // const order = await Order.getOrderById(id);//too heavy for a small query.
        // if (!order) {
        //     return res.status(404).json({ error: "Order not found" });
        // }
        const currentStatus = await Order.getOrderStatus(id);
        if (currentStatus === null) {
            return res.status(404).json({ error: "Order not found" });
        }

        const result = await Order.updateOrderStatus(
            id,
            status,
            currentStatus
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({ message: "Order status updated" });

    } catch (error) {
        // "Invalid status transition" → 400, not 500
        const code = /invalid status transition/i.test(error.message) ? 400 : 500;
        res.status(code).json({ error: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Delegate entirely to the model — it enforces the rules
        // (delivered cannot be cancelled, stock restore, transaction)
        const result = await Order.cancelOrderWithRestore(id);

        if (result.changes === 0) {
            return res.status(400).json({
                error: "Order cannot be cancelled (already cancelled or not found)"
            });
        }

        res.json({ message: "Order cancelled and stock restored" });

    } catch (error) {
        // "Cannot cancel order in status 'delivered'" → 400, not 500
        const code = /cannot cancel|invalid/i.test(error.message) ? 400 : 500;
        res.status(code).json({ error: error.message });
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