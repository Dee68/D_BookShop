const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    try {
        // get header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "No token provided" });
        }

        // format: Bearer token
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Invalid token format" });
        }

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user to request
        req.user = decoded;

        next();

    } catch (error) {
        console.log("JWT ERROR:", error.message);
        return res.status(401).json({ error: "Unauthorized" });
    }
};

exports.requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Admin only" });
    }
    next();
};