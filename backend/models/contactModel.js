const db = require("../config/db");

function createMessage({ name, email, subject, message }) {

    return new Promise((resolve, reject) => {

        const sql = `
            INSERT INTO contact_messages
            (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `;

        db.run(
            sql,
            [name, email, subject, message],
            function (err) {

                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID
                    });
                }
            }
        );
    });
}

module.exports = {
    createMessage
};