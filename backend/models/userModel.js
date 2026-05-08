const db = require('../config/db');

exports.createUser = (user) => {
    const { name, email, password, role } = user;

    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [name, email, password, role],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            }
        );
    });
};

exports.getAllUsers = (page = 1, limit = 5) => {
    const offset = (page - 1) * limit;

    return new Promise((resolve, reject) => {

        const sqlCount = `SELECT COUNT(*) AS count FROM users`;

        db.get(sqlCount, [], (err, countResult) => {
            if (err) return reject(err);

            const total = countResult.count;

            const sqlData = `
                SELECT *
                FROM users
                ORDER BY id DESC
                LIMIT ?
                OFFSET ?
            `;

            db.all(sqlData, [limit, offset], (err, rows) => {
                if (err) return reject(err);

                resolve({
                    data: rows,
                    total
                });
            });
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

exports.updateUserRole = (id, role) => {
    return new Promise((resolve, reject) => {
        db.run(
            `UPDATE users SET role = ? WHERE id = ?`,
            [role, id],
            function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            }
        );
    });
};

exports.deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        db.run(
            `DELETE FROM users WHERE id = ?`,
            [id],
            function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            }
        );
    });
};