const db = require("../backend/config/db");
const bcrypt = require("bcrypt");

async function seedUsers() {

    const users = [
        {
            name: "Admin",
            email: "admin@bookshop.com",
            password: "admin123",
            role: "admin"
        },
        {
            name: "John Doe",
            email: "john@example.com",
            password: "user123",
            role: "customer"
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            password: "user123",
            role: "customer"
        }
    ];

    for (const user of users) {

        try {

            const hashedPassword = await bcrypt.hash(
                user.password,
                10
            );

            await db.query(
                `
                INSERT INTO users
                (name, email, password, role)
                VALUES ($1, $2, $3, $4)
                `,
                [
                    user.name,
                    user.email,
                    hashedPassword,
                    user.role
                ]
            );

            console.log(
                `Inserted user: ${user.email}`
            );

        } catch (err) {

            console.log(
                `Error inserting ${user.email}:`,
                err.message
            );
        }
    }

    console.log("User seeding completed");

    process.exit();
}

seedUsers();