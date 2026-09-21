
// require('dotenv').config();

// const app = require('./app');
// require('./config/db'); // initialize SQLite connection

// const initDb = require('./database/init');

// const PORT = process.env.PORT || 3000;

// async function startServer() {
//     try {
//         await initDb();

//         console.log('Database initialized successfully');

//         app.listen(PORT, () => {
//             console.log(`Server running on http://localhost:${PORT}`);
//         });

//     } catch (err) {
//         console.error('Startup error:', err.message);
//         process.exit(1);
//     }
// }

// startServer();

//==PostgrSql ===
require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');
const initDb = require('./database/init');
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        //await pool.query('SELECT NOW()');
        const { rows } = await pool.query('SELECT NOW()');
        console.log("PostgreSQL connected successfully at", rows[0].now);

        await initDb();
        console.log("Database initialized successfully");

        //const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        const shutdown = async (signal) => {
            console.log(`${signal} received, shutting down...`);
            server.close(async () => {
                await pool.end();
                process.exit(0);
            });
        };

        process.on('SIGINT',  () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));

    } catch (err) {
        console.error("Startup error:", err.message);
        process.exit(1);
    }
}

startServer();