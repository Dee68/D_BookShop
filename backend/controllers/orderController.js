const Order = require('../models/orderModel');

const Product = require('../models/productModel');

const trx = require('../config/dbTransactions');


exports.createOrder = async (req, res) => {
    try {
        const { user_id, items } = req.body;

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

        res.status(201).json(result);

    } catch (error) {
        await trx.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        // 1. get order items
        const items = await Order.getOrderItems(orderId);

        if (!items || items.length === 0) {
            return res.status(404).json({ error: "Order not found or empty" });
        }

        // 2. restore stock
        for (const item of items) {
            await Product.restoreStock(item.product_id, item.quantity);
        }

        // 3. mark order as cancelled
        const result = await Order.cancelOrder(orderId);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({ message: "Order cancelled and stock restored" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.getOrdersByUser(req.params.user_id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};