const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const INVALID_CREDENTIALS = "Invalid credentials";

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}



exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.getUserByEmail(email);
        //Already a user with that email exists
        if (existingUser) {
        return res.status(409).json({
            error: "Email already exists"
        });
    }

        if (!name || name.length < 3) {
            return res.status(400).json({
                error: "Username must be at least 3 characters"
            });
        }

        if (!email || !validateEmail(email)) {
            return res.status(400).json({
                error: "Invalid email format"
            });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({
                error: "Password must be at least 6 characters"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await User.createUser({
            name,
            email,
            password: hashedPassword,
            role: 'customer' // default 
        });

        res.status(201).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const user = await User.getUserByEmail(email);
        console.log("LOGIN USER:", user);
        console.log("PASSWORD MATCH:", await bcrypt.compare(password, user.password));
        if (!user) {
            return res.status(401).json({ error: INVALID_CREDENTIALS });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: INVALID_CREDENTIALS });
        }

        // create token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const result = await User.getAllUsers(page, limit);

        const pages = Math.ceil(result.total / limit);

        res.json({
            data: result.data,
            pagination: {
                page,
                limit,
                total: result.total,
                pages: pages
            }
        });
 
    } catch (error) {
        //console.log("USER PAGINATION ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

        const result = await User.updateUserRole(id, role);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await User.deleteUser(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};