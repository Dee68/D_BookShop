const db = require('../backend/config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
    const password = await bcrypt.hash('admin123', 10);

    db.run(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, ?)`,
        ['Admin', 'admin@bookshop.com', password, 'admin'],
        (err) => {
            if (err) console.log(err.message);
            else console.log('Admin created');
        }
    );
}

createAdmin();