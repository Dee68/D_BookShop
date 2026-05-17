const crypto = require("crypto");

exports.generateVerificationToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

exports.getExpiryTime = () => {
    return new Date(Date.now() + 1000 * 60 * 60); // 1 hour
};