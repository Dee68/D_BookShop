// const db = require('../config/db');

// exports.createUser = (user) => {
//     const { name, email, password, role } = user;

//     return new Promise((resolve, reject) => {
//         db.run(
//             `INSERT INTO users (name, email, password, role)
//              VALUES (?, ?, ?, ?)`,
//             [name, email, password, role],
//             function (err) {
//                 if (err) reject(err);
//                 else resolve({ id: this.lastID });
//             }
//         );
//     });
// };

// exports.getAllUsers = (page = 1, limit = 5) => {
//     const offset = (page - 1) * limit;

//     return new Promise((resolve, reject) => {

//         const sqlCount = `SELECT COUNT(*) AS count FROM users`;

//         db.get(sqlCount, [], (err, countResult) => {
//             if (err) return reject(err);

//             const total = countResult.count;

//             const sqlData = `
//                 SELECT *
//                 FROM users
//                 ORDER BY id DESC
//                 LIMIT ?
//                 OFFSET ?
//             `;

//             db.all(sqlData, [limit, offset], (err, rows) => {
//                 if (err) return reject(err);

//                 resolve({
//                     data: rows,
//                     total
//                 });
//             });
//         });
//     });
// };
// exports.getUserByEmail = (email) => {
//     return new Promise((resolve, reject) => {
//         db.get(
//             `SELECT * FROM users WHERE email = ?`,
//             [email],
//             (err, row) => {
//                 if (err) reject(err);
//                 else resolve(row);
//             }
//         );
//     });
// };

// exports.updateUserRole = (id, role) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             `UPDATE users SET role = ? WHERE id = ?`,
//             [role, id],
//             function (err) {
//                 if (err) reject(err);
//                 else resolve({ changes: this.changes });
//             }
//         );
//     });
// };

// exports.deleteUser = (id) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             `DELETE FROM users WHERE id = ?`,
//             [id],
//             function (err) {
//                 if (err) reject(err);
//                 else resolve({ changes: this.changes });
//             }
//         );
//     });
// };
const db = require("../config/db");

exports.createUser = async (user) => {
    const { name, email, password, role, email_verified, verification_token, verification_expires } = user;

    const result = await db.query(
        `
        INSERT INTO users (name, email, password, role, email_verified, verification_token, verification_expires)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
        `,
        [name, email, password, role, email_verified, verification_token, verification_expires]
    );

    return result.rows[0];
};

exports.getAllUsers = async (page = 1, limit = 5) => {

    const offset = (page - 1) * limit;

    // TOTAL COUNT
    const countResult = await db.query(
        `SELECT COUNT(*) FROM users`
    );

    const total = parseInt(countResult.rows[0].count);

    // USERS
    const usersResult = await db.query(
        `
        SELECT *
        FROM users
        ORDER BY id DESC
        LIMIT $1
        OFFSET $2
        `,
        [limit, offset]
    );

    return {
        data: usersResult.rows,
        total
    };
};

exports.getUserByEmail = async (email) => {

    const result = await db.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0];
};

exports.updateUserRole = async (id, role) => {

    const result = await db.query(
        `
        UPDATE users
        SET role = $1
        WHERE id = $2
        `,
        [role, id]
    );

    return {
        changes: result.rowCount
    };
};

exports.deleteUser = async (id) => {

    const result = await db.query(
        `
        DELETE FROM users
        WHERE id = $1
        `,
        [id]
    );

    return {
        changes: result.rowCount
    };
};