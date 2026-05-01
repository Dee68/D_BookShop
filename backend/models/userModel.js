const db = require('../config/db');

exports.createUser = (user) => {
    const { name, email, password } = user;

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO users (name, email, password)
             VALUES (?, ?, ?)`,
            [name, email, password],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT id, name, email FROM users`, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

exports.getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM users WHERE email = ?`,
            [email],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
};