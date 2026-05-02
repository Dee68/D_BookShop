const db = require('../backend/config/db');
const bcrypt = require('bcrypt');

async function seedUsers() {
    const users = [
        {
            name: 'Admin',
            email: 'admin@bookshop.com',
            password: 'admin123',
            role: 'admin'
        },
        {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'user123',
            role: 'customer'
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'user123',
            role: 'customer'
        }
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (name, email, password, role)
                 VALUES (?, ?, ?, ?)`,
                [user.name, user.email, hashedPassword, user.role],
                (err) => {
                    if (err) {
                        console.log(`Error inserting ${user.email}:`, err.message);
                        resolve(); // continue even if duplicate
                    } else {
                        console.log(`Inserted user: ${user.email}`);
                        resolve();
                    }
                }
            );
        });
    }

    console.log('User seeding completed');
}

seedUsers();