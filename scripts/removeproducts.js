const db = require('../backend/config/db');

db.serialize(() => {
    db.run(`DELETE FROM order_items`);
    db.run(`DELETE FROM orders`);
    db.run(`DELETE FROM product_images`);
    db.run(`DELETE FROM products`);
});
console.log("product table cleaned.");