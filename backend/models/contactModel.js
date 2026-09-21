const db = require("../config/db");

// exports.createMessage = ({ name, email, subject, message }) => {

//     return new Promise((resolve, reject) => {

//         db.run(
//             `
//             INSERT INTO contact_messages
//             (name, email, subject, message)
//             VALUES (?, ?, ?, ?)
//             `,
//             [name, email, subject, message],
//             function (err) {

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve({
//                     id: this.lastID
//                 });
//             }
//         );
//     });
// };

// exports.getAllMessages = () => {

//     return new Promise((resolve, reject) => {

//         db.all(
//             `
//             SELECT *
//             FROM contact_messages
//             ORDER BY id DESC
//             `,
//             [],
//             (err, rows) => {

//                 if (err) {
//                     return reject(err);
//                 }

//                 resolve(rows);
//             }
//         );

//     });
// };

// exports.toggleStatus = (id) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             `UPDATE contact_messages
//              SET status = CASE
//                  WHEN status = 'read' THEN 'new'
//                  ELSE 'read'
//              END
//              WHERE id = ?`,
//             [id],
//             function (err) {
//                 if (err) return reject(err);
//                 resolve({ changes: this.changes });
//             }
//         );
//     });
// };

//== PostgreSql =========

exports.createMessage = async ({name, email, subject, message})=>{
    const result = await db.query(`
        INSERT INTO contact_messages
        (name, email, subject, message)
        VALUES ($1, $2, $3, $4)
        RETURNING id`, 
        [name,email,subject,message]
    );
    return result.rows[0];
}

exports.getAllMessages = async () => {
    const result = await db.query(`
        SELECT *
        FROM contact_messages
        ORDER BY id DESC
    `);

    return result.rows;
};

exports.toggleStatus = async (id) => {
    const result = await db.query(
        `UPDATE contact_messages
         SET status = CASE
             WHEN status = 'read' THEN 'new'
             ELSE 'read'
         END
         WHERE id = $1`,
        [id]
    );
    return { changes: result.rowCount };
};