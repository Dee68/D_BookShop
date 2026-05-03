const Order = require('../models/orderModel');

const Product = require('../models/productModel');

const trx = require('../config/dbTransactions');


exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const user_id = req.user.id;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Items must be a non-empty array" });
        }

        await trx.beginTransaction();

        let total = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = await Product.getProductByIdSimple(item.product_id);

            if (!product) {
                await trx.rollback();
                return res.status(400).json({ error: "Product not found" });
            }

            if (product.stock < item.quantity) {
                await trx.rollback();
                return res.status(400).json({
                    error: `Insufficient stock for ${product.title}`
                });
            }

            total += product.price * item.quantity;

            validatedItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: product.price
            });
        }

        const result = await Order.createOrder(user_id, validatedItems, total);

        for (const item of validatedItems) {
            await Product.reduceStock(item.product_id, item.quantity);
        }

        await trx.commit();

        res.status(201).json({
            message: "Order created",
            orderId: result.orderId
        });

    } catch (error) {
        await trx.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Ownership check
        if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // restore stock
        const items = await Order.getOrderItems(orderId);

        for (const item of items) {
            await Product.restoreStock(item.product_id, item.quantity);
        }

        const result = await Order.cancelOrder(orderId);

        res.json({ message: "Order cancelled and stock restored" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getOrders = async (req, res) => {
    try {
        let orders;

        if (req.user.role === 'admin') {
            // admin => get all orders
            orders = await Order.getAllOrders();
        } else {
            // customer => only their own
            orders = await Order.getOrdersByUser(req.user.id);
        }

        res.json(orders);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAllOrders();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const order = await Order.getOrderById(orderId); // add this if not existing

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        const result = await Order.updateOrderStatus(
            orderId,
            status,
            order.status
        );

        res.json(result);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};