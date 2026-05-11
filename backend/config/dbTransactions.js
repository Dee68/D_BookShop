// const db = require('./db');

// exports.beginTransaction = () => {
//     return new Promise((resolve, reject) => {
//         db.run('BEGIN TRANSACTION', err => {
//             if (err) reject(err);
//             else resolve();
//         });
//     });
// };

// exports.commit = () => {
//     return new Promise((resolve, reject) => {
//         db.run('COMMIT', err => {
//             if (err) reject(err);
//             else resolve();
//         });
//     });
// };

// exports.rollback = () => {
//     return new Promise((resolve) => {
//         db.run('ROLLBACK', () => resolve());
//     });
// };
const pool = require("./db");

async function beginTransaction() {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        return client;

    } catch (err) {

        client.release();

        throw err;
    }
}

async function commit(client) {

    try {

        await client.query("COMMIT");

    } finally {

        client.release();
    }
}

async function rollback(client) {

    try {

        await client.query("ROLLBACK");

    } finally {

        client.release();
    }
}

module.exports = {
    beginTransaction,
    commit,
    rollback
};