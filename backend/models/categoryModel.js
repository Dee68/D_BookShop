const db = require('../config/db');

// exports.getAllCategories = (page = 1, limit = 5) => {
 
//     return new Promise((resolve, reject) => {
 
//         const offset = (page - 1) * limit;

//          const sqlCount = `SELECT COUNT(*) AS count FROM categories`;

//          db.get(sqlCount, [], (err, countResult) => {
//             if (err) return reject(err);

//             const total = countResult.count;

//             const sqlData = `
//                 SELECT *
//                 FROM categories
//                 ORDER BY id ASC
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

// exports.getCategoriesForStore = () => {

//     return new Promise((resolve, reject) => {

//         const sql = `
//             SELECT *
//             FROM categories
//             ORDER BY name ASC
//         `;

//         db.all(sql, [], (err, rows) => {

//             if (err) reject(err);
//             else resolve(rows);
//         });
//     });
// };

// exports.createCategory = (name) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             "INSERT INTO categories (name) VALUES (?)",
//             [name],
//             function (err) {
//                 if (err) reject(err);
//                 else resolve({ id: this.lastID });
//             }
//         );
//     });
// };
// exports.updateCategory = (id, name) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             "UPDATE categories SET name = ? WHERE id = ?",
//             [name, id],
//             function (err) {
//                 if (err) reject(err);
//                 else resolve({ changes: this.changes });
//             }
//         );
//     });
// };

// exports.deleteCategory = (id) => {
//     return new Promise((resolve, reject) => {
//         db.run(
//             "DELETE FROM categories WHERE id = ?",
//             [id],
//             function (err) {
//                 if (err) reject(err);
//                 else resolve({ changes: this.changes });
//             }
//         );
//     });
// };

// exports.getCategoryById = (id) => {
//     return new Promise((resolve, reject) => {
//         db.get(
//             "SELECT * FROM categories WHERE id = ?",
//             [id],
//             (err, row) => {
//                 if (err) reject(err);
//                 else resolve(row);
//             }
//         );
//     });
// };

exports.getAllCategories = async (page = 1, limit = 5) => {

    const offset = (page - 1) * limit;

    // COUNT QUERY
    const countResult = await db.query(`
        SELECT COUNT(*) AS count
        FROM categories
    `);

    const total = parseInt(countResult.rows[0].count);

    // DATA QUERY
    const dataResult = await db.query(
        `
        SELECT *
        FROM categories
        ORDER BY id ASC
        LIMIT $1
        OFFSET $2
        `,
        [limit, offset]
    );

    return {
        data: dataResult.rows,
        total
    };
};

exports.getCategoriesForStore = async () => {

    const result = await db.query(`
        SELECT *
        FROM categories
        ORDER BY name ASC
    `);

    return result.rows;
};

exports.updateCategory = async (id,name)=>{
    const result = await db.query(`
        UPDATE categories 
        SET name = $1 
        WHERE id = $2`,
        [name,id]
    );
    return {
        changes:result.rowCount
    };
}

exports.deleteCategory = async (id)=>{
    const result = await db.query(`
        DELETE FROM categories WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}

exports.getCategoryById = async (id)=>{
    const result = await db.query(`
        SELECT * FROM categories WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}

exports.createCategory = async (name) =>{
    const result = await db.query(`
        INSERT INTO categories (name) 
        VALUES ($1)
        RETURNING id`,
        [name]
    );
    return result.rows[0];
}