const db = require('../config/db');
// const RESET_DB = process.env.RESET_DB === "true";
// if (RESET_DB) {
//     db.serialize(() => {
//         db.run(`DROP TABLE IF EXISTS order_items`);
//         db.run(`DROP TABLE IF EXISTS orders`);
//         db.run(`DROP TABLE IF EXISTS product_images`);
//         db.run(`DROP TABLE IF EXISTS products`);
//         db.run(`DROP TABLE IF EXISTS categories`);
//         db.run(`DROP TABLE IF EXISTS users`);
//         db.run(`DROP TABLE IF EXISTS contact_messages`)
//     });
// }

// Enable foreign keys
db.run(`PRAGMA foreign_keys = ON`);

// Categories
db.run(`
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
)
`);

// Products
db.run(`
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT,
    price REAL NOT NULL,
    category_id INTEGER,
    stock INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
)
`);

// Product Images
db.run(`
CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
)
`);

// Users
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer'
)
`);

// Orders
db.run(`
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending'
    CHECK (
        status IN (
            'pending',
            'shipped',
            'delivered',
            'cancelled'
        )
    ),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
`);

// Order Items
db.run(`
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
)
`);
// Contact Messages
db.run(`
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new'
    CHECK(status IN ('new', 'read', 'replied')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

console.log("Tables created successfully");