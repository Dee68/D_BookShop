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
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};