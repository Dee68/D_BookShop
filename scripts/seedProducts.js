const db = require('../backend/config/db');

const products = [
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        price: 29.99,
        category_id: 2,
        stock: 10
    },
    {
        title: "Atomic Habits",
        author: "James Clear",
        price: 19.99,
        category_id: 2,
        stock: 15
    },
    {
        title: "Brief History of Time",
        author: "Stephen Hawking",
        price: 25.00,
        category_id: 3,
        stock: 8
    }
];

products.forEach(p => {
    db.run(
        `INSERT INTO products (title, author, price, category_id, stock)
         VALUES (?, ?, ?, ?, ?)`,
        [p.title, p.author, p.price, p.category_id, p.stock],
        (err) => {
            if (err) {
                console.log("Product error:", err.message);
            } else {
                console.log("Inserted product:", p.title);
            }
        }
    );
});