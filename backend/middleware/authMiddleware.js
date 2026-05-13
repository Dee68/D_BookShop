// const jwt = require('jsonwebtoken');

// exports.auth = (req, res, next) => {
//     try {
//         // get header
//         const authHeader = req.headers.authorization || req.headers['authorization'];

//         if (!authHeader) {
//             return res.status(401).json({ error: "No token provided" });
//         }

//         // format: Bearer token
//         const token = authHeader.split(' ')[1];

//         if (!token) {
//             return res.status(401).json({ error: "Invalid token format" });
//         }

//         // verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // attach user to request
//         req.user = decoded;

//         next();

//     } catch (error) {
//         console.log("JWT ERROR:", error.message);
//         return res.status(401).json({ error: "Unauthorized" });
//     }
// };

// exports.requireAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ error: "Admin only" });
//     }
//     next();
// };
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
    try {
        const authHeader =
            req.headers.authorization ||
            req.headers["authorization"];
        console.log("AUTH HEADER:", authHeader);
        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }

        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ error: "Invalid token format" });
        }

        const token = parts[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.name, error.message);
        return res.status(401).json({ error: "Unauthorized" });
    }
};

exports.requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Admin only" });
    }

    next();
};