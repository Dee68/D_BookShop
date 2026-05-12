const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        const user_id = req.user.id;

        if (!items?.length) {
            return res.status(400).json({ error: "Items required" });
        }

        let total = 0;
        const validated = [];

        for (const item of items) {

            const product = await Product.getProductByIdSimple(item.product_id);

            if (!product) {
                return res.status(400).json({ error: "Product not found" });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    error: `Insufficient stock for ${product.title}`
                });
            }

            total += Number(product.price) * item.quantity;

            validated.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: product.price
            });
        }

        const result = await Order.createOrder(user_id, validated, total);

        res.status(201).json({
            message: "Order created",
            orderId: result.orderId
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.cancelOrder = async (req, res) => {

    try {

        const orderId = req.params.id;

        const order = await Order.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({ error: "Already cancelled" });
        }

        if (req.user.role !== "admin" && order.user_id !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        await Order.cancelOrderWithRestore(orderId);

        res.json({ message: "Order cancelled" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// exports.updateStatus = async (req, res) => {

//     try {

//         const { status } = req.body;
//         const orderId = req.params.id;

//         const order = await Order.getOrderById(orderId);

//         if (!order) {
//             return res.status(404).json({ error: "Order not found" });
//         }

//         if (status === "cancelled") {
//             await Order.cancelOrderWithRestore(orderId);
//             return res.json({ message: "Order cancelled" });
//         }

//         const result = await Order.updateOrderStatus(
//             orderId,
//             status,
//             order.status
//         );

//         res.json(result);

//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// exports.updateStatus = async (req, res) => {
//     try {
//         const { status } = req.body;
//         const orderId = req.params.id;

//         const order = await Order.getOrderById(orderId);

//         if (!order) {
//             return res.status(404).json({ error: "Order not found" });
//         }

//         if (req.user.role !== "admin" && order.user_id !== req.user.id) {
//             return res.status(403).json({ error: "Forbidden" });
//         }

//         // cancellation is a special atomic operation
//         if (status === "cancelled") {
//             await Order.cancelOrderWithRestore(orderId);
//             return res.json({ message: "Order cancelled and stock restored" });
//         }

//         const result = await Order.updateOrderStatus(
//             orderId,
//             status,
//             order.status
//         );

//         res.json(result);

//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;

        const order = await Order.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (req.user.role !== "admin" && order.user_id !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        // prevent invalid cancellation
        if (status === "cancelled") {

            if (order.status === "delivered") {
                return res.status(400).json({
                    error: "Delivered orders cannot be cancelled"
                });
            }

            await Order.cancelOrderWithRestore(orderId);

            return res.json({
                message: "Order cancelled and stock restored"
            });
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

exports.getOrders = async (req, res) => {

    try {

        const orders = req.user.role === "admin"
            ? await Order.getAllOrders()
            : await Order.getOrdersByUser(req.user.id);

        res.json(orders);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async (req, res) => {

    try {

        const order = await Order.getOrderById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (req.user.role !== "admin" && order.user_id !== req.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        res.json(order);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};