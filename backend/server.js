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
require('./database/init')();
const app = require('./app');
const pool = require('./config/db'); // pg Pool
const seedAdmin = require("../scripts/seedAdmin");
const resetAdmin = require("../scripts/resetAdmin");


async function startServer() {
    try {
        await pool.query('SELECT NOW()'); // test DB connection
        console.log("PostgreSQL connected successfully");
        
        await resetAdmin();

       await seedAdmin();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("PostgreSQL connection failed:", err.message);
        process.exit(1);
    }
}

startServer();