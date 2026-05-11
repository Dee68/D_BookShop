// const sqlite3 = require('sqlite3').verbose();
// require('dotenv').config();

// const db = new sqlite3.Database(process.env.DB_PATH, (err) => {
//     if (err) {
//         console.error('Database connection error:', err.message);
//     } else {
//         console.log('Connected to SQLite database');
//     }
// });

// module.exports = db;
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
// Test connection
pool.connect()
    .then(client => {
        console.log("Connected to PostgreSQL");

        client.release();
    })
    .catch(err => {
        console.error("PostgreSQL connection error:", err.message);
    });

module.exports = pool;