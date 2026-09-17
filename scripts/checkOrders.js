const db = require('../backend/config/db');

db.all(
    `
    SELECT
        id,
        user_id,
        total,
        status,
        created_at
    FROM orders
    ORDER BY id ASC
    `,
    [],
    (err, rows) => {

        if (err) {
            console.error('Error:', err.message);
            return;
        }

        console.table(rows);
    }
);