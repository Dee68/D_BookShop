const db = require('./db');

exports.beginTransaction = () => {
    return new Promise((resolve, reject) => {
        db.run('BEGIN TRANSACTION', err => {
            if (err) reject(err);
            else resolve();
        });
    });
};

exports.commit = () => {
    return new Promise((resolve, reject) => {
        db.run('COMMIT', err => {
            if (err) reject(err);
            else resolve();
        });
    });
};

exports.rollback = () => {
    return new Promise((resolve) => {
        db.run('ROLLBACK', () => resolve());
    });
};