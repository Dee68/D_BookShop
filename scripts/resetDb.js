const db = require('../backend/config/db');

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS order_items`);
    db.run(`DROP TABLE IF EXISTS orders`);
    db.run(`DROP TABLE IF EXISTS product_images`);
    db.run(`DROP TABLE IF EXISTS products`);
    db.run(`DROP TABLE IF EXISTS categories`);
    db.run(`DROP TABLE IF EXISTS users`);
    db.run(`DROP TABLE IF EXISTS contact_messages`)

    console.log("Database reset completed");
});