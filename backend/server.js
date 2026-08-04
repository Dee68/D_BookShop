// require('dotenv').config();

// if (!process.env.JWT_SECRET) {
//             throw new Error("JWT_SECRET is not defined");
// }
// const app = require('./app');

// require('./config/db'); // initialize DB

//require('./database/init');

// const PORT = process.env.PORT || 3000;




// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
// require('./database/init')();
// const app = require('./app');
// const pool = require('./config/db'); // pg Pool
// //const seedAdmin = require("../scripts/seedAdmin");
// //const resetAdmin = require("../scripts/resetAdmin");


// async function startServer() {
//     try {
//         await pool.query('SELECT NOW()'); // test DB connection
//         console.log("PostgreSQL connected successfully");

//         //await resetAdmin();

//        //await seedAdmin();

//         const PORT = process.env.PORT || 5000;

//         app.listen(PORT, () => {
//             console.log(`Server running on http://localhost:${PORT}`);
//         });

//     } catch (err) {
//         console.error("PostgreSQL connection failed:", err.message);
//         process.exit(1);
//     }
// }

// startServer();
require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');
const initDb = require('./database/init');

async function startServer() {
    try {
        await pool.query('SELECT NOW()');
        console.log("PostgreSQL connected successfully");

        await initDb();
        console.log("Database initialized successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("Startup error:", err.message);
        process.exit(1);
    }
}

startServer();