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
// const { Pool } = require("pg");
// require("dotenv").config();

// const isProduction = process.env.NODE_ENV === "production";

// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,

//     ssl: isProduction
//         ? { rejectUnauthorized: false }
//         : false
// });

// module.exports = pool;
// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,

//     ssl: process.env.NODE_ENV === "production"
//         ? { rejectUnauthorized: false }
//         : false
// });

// module.exports = pool;
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;