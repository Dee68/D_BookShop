const db = require('../backend/config/db');
const Order = require('../backend/models/orderModel');
const Product = require('../backend/models/productModel');

async function seedOrders() {
    try {
        const users = [2,3]; 

        for (const user_id of users) {

            const items = [
                { product_id: 6, quantity: 2 },
                { product_id: 7, quantity: 1 }
            ];

            let total = 0;
            const validatedItems = [];

            for (const item of items) {
                const product = await Product.getProductByIdSimple(item.product_id);

                if (!product) continue;

                total += product.price * item.quantity;

                validatedItems.push({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: product.price
                });
            }

            if (validatedItems.length > 0) {
                const result = await Order.createOrder(user_id, validatedItems, total);

                for (const item of validatedItems) {
                    await Product.reduceStock(item.product_id, item.quantity);
                }

                console.log(`Order created for user ${user_id}:`, result.orderId);
            }
        }

        console.log("Orders seeded successfully");

    } catch (error) {
        console.error(error.message);
    }
}

seedOrders();