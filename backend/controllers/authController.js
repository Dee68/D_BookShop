// const db = require("../config/db");

// exports.verifyEmail = async (req, res) => {

//     try {

//         const { token } = req.query;

//         if (!token) {
//             return res.status(400).json({
//                 error: "Token required"
//             });
//         }

//         const user = await new Promise((resolve, reject) => {

//             db.get(
//                 `
//                 SELECT id
//                 FROM users
//                 WHERE verification_token = ?
//                 AND verification_expires > CURRENT_TIMESTAMP
//                 `,
//                 [token],
//                 (err, row) => {

//                     if (err) {
//                         return reject(err);
//                     }

//                     resolve(row);
//                 }
//             );
//         });

//         if (!user) {
//             return res.status(400).json({
//                 error: "Invalid or expired token"
//             });
//         }

//         await new Promise((resolve, reject) => {

//             db.run(
//                 `
//                 UPDATE users
//                 SET email_verified = 1,
//                     verification_token = NULL,
//                     verification_expires = NULL
//                 WHERE id = ?
//                 `,
//                 [user.id],
//                 (err) => {

//                     if (err) {
//                         return reject(err);
//                     }

//                     resolve();
//                 }
//             );
//         });

//         return res.json({
//             success: true,
//             message: "Email verified successfully"
//         });

//     } catch (err) {

//         console.error(err);

//         return res.status(500).json({
//             error: "Server error"
//         });
//     }
// };

//==PostgreSql ==
const db = require("../config/db");

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: "Token required" });
        }

        const user = await db.query(
            `
            SELECT id
            FROM users
            WHERE verification_token = $1
            AND verification_expires > NOW()
            `,
            [token]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({
                error: "Invalid or expired token"
            });
        }

        await db.query(
            `
            UPDATE users
            SET email_verified = true,
                verification_token = NULL,
                verification_expires = NULL
            WHERE id = $1
            `,
            [user.rows[0].id]
        );

        return res.json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (err) {
        //console.error(err);
        console.error("verifyEmail failed for token:", req.query.token, err);
        return res.status(500).json({ error: "Server error" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;   // set by your auth middleware

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Both fields are required" });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        const result = await db.query(
            `SELECT password FROM users WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await db.query(
            `UPDATE users SET password = $1 WHERE id = $2`,
            [hashed, userId]
        );

        res.json({ success: true, message: "Password updated" });

    } catch (err) {
        console.error("changePassword error:", err);
        res.status(500).json({ error: "Server error" });
    }
};