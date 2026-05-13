const db = require("../config/db");

// function createMessage({ name, email, subject, message }) {

//     return new Promise((resolve, reject) => {

//         const sql = `
//             INSERT INTO contact_messages
//             (name, email, subject, message)
//             VALUES (?, ?, ?, ?)
//         `;

//         db.run(
//             sql,
//             [name, email, subject, message],
//             function (err) {

//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve({
//                         id: this.lastID
//                     });
//                 }
//             }
//         );
//     });
// }

// module.exports = {
//     createMessage
// };

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